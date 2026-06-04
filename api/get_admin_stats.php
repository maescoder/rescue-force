<?php
// api/get_admin_stats.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../inc/db_config.php';

try {
    // totals
    $total_animals = (int)$pdo->query("SELECT COUNT(*) FROM animals")->fetchColumn();
    $total_reports = (int)$pdo->query("SELECT COUNT(*) FROM reports")->fetchColumn();
    $total_adoptions = (int)$pdo->query("SELECT COUNT(*) FROM adoptions")->fetchColumn();

    // last 6 months labels and counts for animals.created_at
    $stmt = $pdo->prepare("
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS ym, COUNT(*) AS cnt
      FROM animals
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)
      GROUP BY ym
      ORDER BY ym
    ");
    $stmt->execute();
    $rows = $stmt->fetchAll();

    // build last 6 months labels (including months with 0)
    $months = [];
    $counts = [];
    $period = new DatePeriod(
        new DateTime(date('Y-m-01', strtotime('-5 months'))),
        new DateInterval('P1M'),
        6
    );
    $map = [];
    foreach ($rows as $r) $map[$r['ym']] = (int)$r['cnt'];
    foreach ($period as $dt) {
        $key = $dt->format('Y-m');
        $months[] = $key;
        $counts[] = isset($map[$key]) ? $map[$key] : 0;
    }

    // recent animals (5)
    $stmt2 = $pdo->query("SELECT id, name, species, image_path, created_at FROM animals ORDER BY created_at DESC LIMIT 5");
    $recent_animals = $stmt2->fetchAll();
    $ra_html = '';
    foreach ($recent_animals as $a) {
        $img = $a['image_path'] ? '<img src="'.htmlspecialchars($a['image_path']).'" style=\"width:60px;height:60px;object-fit:cover;border-radius:6px;margin-right:8px;vertical-align:middle\">' : '';
        $ra_html .= "<div style='margin-bottom:8px'>{$img}<strong>".htmlspecialchars($a['name']?:'—')."</strong> <span class='small'>".htmlspecialchars($a['species']?:'—')."</span><br><span class='small'>".htmlspecialchars($a['created_at'])."</span></div>";
    }

    // recent reports (5)
    $stmt3 = $pdo->query("SELECT id, type, location, urgency, created_at FROM reports ORDER BY created_at DESC LIMIT 5");
    $recent_reports = $stmt3->fetchAll();
    $rr_html = '';
    foreach ($recent_reports as $r) {
        $rr_html .= "<div style='margin-bottom:8px'><strong>".htmlspecialchars($r['type']?:'Report')."</strong> — ".htmlspecialchars($r['location'])." <span class='small'>(".htmlspecialchars($r['urgency']).")</span><br><span class='small'>".htmlspecialchars($r['created_at'])."</span></div>";
    }

    echo json_encode([
      'total_animals'=>$total_animals,
      'total_reports'=>$total_reports,
      'total_adoptions'=>$total_adoptions,
      'months'=>$months,
      'month_counts'=>$counts,
      'recent_animals_html'=>$ra_html,
      'recent_reports_html'=>$rr_html
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error'=>'db']);
}
