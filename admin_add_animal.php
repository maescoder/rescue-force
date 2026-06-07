<?php
require_once __DIR__ . '/inc/auth.php';
require_once __DIR__ . '/inc/db_config.php'; 
$UPLOAD_DIR = __DIR__ . '/uploads/';  
$UPLOAD_URL = 'uploads/';           
$MAX_FILE_BYTES = 2 * 1024 * 1024;   
$ALLOWED_EXT = ['jpg','jpeg','png','webp'];

function flash($msg, $type = 'info') {
    $_SESSION['flash'] = ['msg'=>$msg, 'type'=>$type];
}

function show_flash() {
    if(!empty($_SESSION['flash'])) {
        $f = $_SESSION['flash'];
        echo "<div style='padding:10px;margin:10px 0;border-radius:6px;background:" .
             ($f['type']=='error' ? '#ffdddd' : '#ddffdd') . ";color:#111;'>".htmlspecialchars($f['msg'])."</div>";
        unset($_SESSION['flash']);
    }
}

if (isset($_POST['action']) && $_POST['action'] === 'login') {
    $username = $_POST['username'] ?? '';
    $pw = $_POST['password'] ?? '';
    
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();
    
    if ($admin && password_verify($pw, $admin['password_hash'])) {
        $_SESSION['admin_logged_in'] = true;
        flash('Login successful', 'info');
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    } else {
        flash('Invalid username or password', 'error');
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

// require login for the upload actions
$loggedIn = is_admin_logged_in();

// --------- Handle form POST for adding animal ----------
if ($loggedIn && isset($_POST['action']) && $_POST['action'] === 'add_animal') {
    $name = trim($_POST['name'] ?? '');
    $age = trim($_POST['age'] ?? '');
    $species = trim($_POST['species'] ?? '');
    $story = trim($_POST['story'] ?? '');
    $rescued_on = trim($_POST['rescued_on'] ?? null);

    // Basic validation
    if ($name === '' || $species === '') {
        flash('Please provide at least name and species.', 'error');
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    }

    // Handle file upload (optional)
    $image_path = null;
    if (!empty($_FILES['image']['tmp_name'])) {
        $f = $_FILES['image'];

        if ($f['error'] !== UPLOAD_ERR_OK) {
            flash('Error uploading file (code '.$f['error'].')', 'error');
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        }

        if ($f['size'] > $MAX_FILE_BYTES) {
            flash('File too large. Max 2 MB allowed.', 'error');
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        }

        // Validate MIME using finfo
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($f['tmp_name']);
        $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));

        $mime_ok = in_array($mime, ['image/jpeg','image/png','image/webp']);
        $ext_ok = in_array($ext, $ALLOWED_EXT);

        if (!($mime_ok && $ext_ok)) {
            flash('Invalid image type. Allowed: JPG, PNG, WEBP.', 'error');
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        }

        // Make sure upload dir exists
        if (!is_dir($UPLOAD_DIR)) {
            @mkdir($UPLOAD_DIR, 0755, true);
        }

        // create a safe unique filename
        $filename = uniqid('animal_', true) . '.' . $ext;
        $dest = $UPLOAD_DIR . $filename;

        if (!move_uploaded_file($f['tmp_name'], $dest)) {
            flash('Could not move uploaded file.', 'error');
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        }

        $image_path = $UPLOAD_URL . $filename;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO animals (name, age, species, story, image_path, rescued_on) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $age, $species, $story, $image_path, $rescued_on ?: null]);
        flash('Animal added successfully!', 'info');
    } catch (Exception $e) {
        // remove uploaded file if DB failed
        if ($image_path && file_exists($dest)) @unlink($dest);
        flash('Database error: ' . $e->getMessage(), 'error');
    }
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}
$animals = [];
try {
    $q = $pdo->query("SELECT id, name, species, story, image_path, rescued_on, created_at FROM animals ORDER BY created_at DESC LIMIT 50");
    $animals = $q->fetchAll();
} catch (Exception $e) {
    // ignore for now
}

?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Admin - Add Animal</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body{font-family:Segoe UI,Arial;background:#f6f7fb;color:#111;padding:20px}
    .box{max-width:900px;margin:0 auto;background:#fff;padding:18px;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.06)}
    label{display:block;margin-top:10px;font-weight:600}
    input[type="text"], input[type="date"], textarea, select {width:100%;padding:10px;border-radius:6px;border:1px solid #ddd;margin-top:6px}
    input[type="file"]{margin-top:8px}
    button{background:#2d8f6f;color:#fff;border:none;padding:10px 14px;border-radius:8px;cursor:pointer;margin-top:12px}
    .thumb{width:110px;height:110px;object-fit:cover;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.12)}
    .row{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px}
    .animal-card{background:#fafafa;padding:10px;border-radius:8px;border:1px solid #eee;width:calc(33% - 12px);box-sizing:border-box}
    .topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
    .login-box{max-width:400px;margin:40px auto;background:#fff;padding:18px;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.06)}
    .btn-logout{background:#e35b5b}
    @media(max-width:800px){ .animal-card{width:calc(50% - 12px)} }
    @media(max-width:480px){ .animal-card{width:100%} }
  </style>
</head>
<body>
<div class="box">
  <div class="topbar">
    <h2>Admin: Add Animal</h2>
    <?php if($loggedIn): ?>
      <div>
        <a href="?logout=1"><button class="btn-logout">Logout</button></a>
      </div>
    <?php endif; ?>
  </div>

  <?php show_flash(); ?>

  <?php if(!$loggedIn): ?>
    <div class="login-box">
      <h3>Admin login</h3>
      <form method="post" action="">
        <input type="hidden" name="action" value="login">
        <label for="username">Username</label>
        <input type="text" name="username" id="username" required>
        <label for="password">Password</label>
        <input type="password" name="password" id="password" required>
        <button type="submit">Login</button>
      </form>
      <p style="margin-top:10px;font-size:0.9rem;color:#666">Login with your database credentials.</p>
    </div>
  <?php else: ?>
    <form method="post" enctype="multipart/form-data" action="">
      <input type="hidden" name="action" value="add_animal">
      <label for="name">Name (optional)</label>
      <input type="text" name="name" id="name" placeholder="e.g., Bella">

      <label for="age">Age (optional)</label>
      <input type="text" name="age" id="age" placeholder="e.g., 2 years">

      <label for="species">Species</label>
      <input type="text" name="species" id="species" placeholder="e.g., Dog" required>

      <label for="story">Story (short)</label>
      <textarea name="story" id="story" rows="4" placeholder="A short rescue story..."></textarea>

      <label for="rescued_on">Rescued on (optional)</label>
      <input type="date" name="rescued_on" id="rescued_on">

      <label for="image">Image (jpg, png, webp) — max 2 MB</label>
      <input type="file" name="image" id="image" accept="image/*">

      <button type="submit">Add Animal</button>
    </form>

    <h3 style="margin-top:20px">Recently added animals</h3>
    <div class="row">
      <?php if(empty($animals)): ?>
        <p style="color:#666">No animals yet.</p>
      <?php else: foreach($animals as $a): ?>
        <div class="animal-card">
          <?php if(!empty($a['image_path'])): ?>
            <img class="thumb" src="<?php echo htmlspecialchars($a['image_path']); ?>" alt="" />
          <?php else: ?>
            <div style="width:110px;height:110px;border-radius:8px;background:#eee;display:inline-block"></div>
          <?php endif; ?>
          <div style="margin-top:8px">
            <strong><?php echo htmlspecialchars($a['name'] ?: '—'); ?></strong><br>
            <small><?php echo htmlspecialchars($a['species'] ?: '—'); ?></small><br>
            <small style="color:#666"><?php echo htmlspecialchars($a['rescued_on'] ?: $a['created_at']); ?></small>
            <?php if(!empty($a['story'])): ?>
              <p style="margin-top:8px;font-size:0.95rem;color:#333"><?php echo nl2br(htmlspecialchars($a['story'])); ?></p>
            <?php endif;?>
          </div>
        </div>
      <?php endforeach; endif; ?>
    </div>
  <?php endif; ?>

  <p style="margin-top:18px;font-size:0.9rem;color:#666">Tip: After you add animals, the gallery can be switched to load from the database using the <code>api/get_animals.php</code> endpoint.</p>
</div>
</body>
</html>
