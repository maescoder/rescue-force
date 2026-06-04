<?php
// adoption.php
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Pet Adoption Form</title>
  <link rel="stylesheet" href="assets/styles.css">
  <style>
    body { background-color:#1b1b2f; color:white; font-family: Arial, sans-serif; margin:0; display:flex; justify-content:center; align-items:center; height:100vh; }
    #form-section{background:#2d2d44;padding:30px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.4); width:100%;max-width:420px;}
    input, textarea, select{width:100%;padding:10px;border-radius:6px;border:none;background:#444;color:#fff;margin-top:5px;}
    button{background:#4fd1c5;color:white;border:none;padding:12px;margin-top:20px;width:100%;font-size:1rem;border-radius:10px;cursor:pointer;}
    button:hover{transform:scale(1.02)}
  </style>
</head>
<body>
  <section id="form-section">
    <h2>Pet Adoption Form</h2>
    <form id="adoptionForm" action="adoption_submit.php" method="POST">
      <label for="fullName">Full Name:</label>
      <input type="text" name="fullName" id="fullName" required />

      <label for="email">Email Address:</label>
      <input type="email" name="email" id="email" required />

      <label for="phone">Phone Number:</label>
      <input type="tel" name="phone" id="phone" required />

      <label for="petType">Type of Pet Interested In:</label>
      <select name="petType" id="petType" required>
        <option value="" disabled selected>Select a pet type</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="rabbit">Rabbit</option>
        <option value="bird">Bird</option>
        <option value="other">Other</option>
      </select>

      <label for="experience">Do you have prior experience caring for pets?</label>
      <select name="experience" id="experience" required>
        <option value="" disabled selected>Select your experience</option>
        <option value="none">No experience</option>
        <option value="some">Some experience</option>
        <option value="extensive">Extensive experience</option>
      </select>

      <label for="livingSituation">Living Situation:</label>
      <select name="livingSituation" id="livingSituation" required>
        <option value="" disabled selected>Select your living situation</option>
        <option value="house">House with yard</option>
        <option value="apartment">Apartment</option>
        <option value="shared">Shared accommodation</option>
        <option value="other">Other</option>
      </select>

      <label for="additionalInfo">Additional Information (optional):</label>
      <textarea name="additionalInfo" id="additionalInfo" rows="4" placeholder="Tell us anything else you want to share..."></textarea>

      <button type="submit">Submit Adoption Request</button>
    </form>
  </section>

  <script>
  document.getElementById('adoptionForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      const res = await fetch(form.action, { method: 'POST', body: fd });
      const data = await res.json();
      alert(data.msg || (data.success ? 'Submitted' : 'Error'));
      if (data.success) form.reset();
    } catch (err) {
      alert('Network error — try again');
    }
  });
  </script>
</body>
</html>
