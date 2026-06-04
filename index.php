<?php
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Pet Rescue Center</title>
  <link rel="stylesheet" href="assets/styles.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
  <header>
    <h1>Be the Hero: Join the Animal Rescue Mission</h1>
    <h2 style="color:#ffaadd; margin-top: 2rem;">
        🐾 Animals Rescued So Far: <span id="counter">0</span>
      </h2>
<button id="theme-toggle" style="float:right;margin:10px 20px 0 0;background:#444;color:#fff;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;">🌙 Dark Mode</button>
<script>
document.getElementById('theme-toggle').onclick = function() {
  const body = document.body;
  const header = document.querySelector('header');
  if(body.style.backgroundColor === 'white' || body.style.backgroundColor === "") {
    body.style.backgroundColor = '#1e1e2f';
    header.style.backgroundColor = '#2c2c44';
    this.textContent = '🌙 Dark Mode';
  } else {
    body.style.backgroundColor = 'white';
    header.style.backgroundColor = '#fff';
    this.textContent = '☀️ Light Mode';
  }
};
</script>
      
  </header>
  <div class="intro-container">
    <img src="assets/images/rescue-force-logo.jpg" alt="Rescue Force Logo" />
    <div class="story-text">
      <h2 style="color: #ae2c3b;">About Rescue Force</h2>
      <p>
        <strong>Rescue Force</strong> is a heartfelt initiative started by a group of passionate animal lovers who couldn’t ignore the cries of the voiceless.
        <br><br>
        Founded in 2020, the initiative began as a local effort to help injured and abandoned street animals. Over time, it grew into a powerful movement with the support of local communities.
        <br><br>
        While it initially focused on rescuing dogs and cats, our mission has expanded to include birds, cows, monkeys, and even reptiles in distress.
        <br><br>
        We collaborate with veterinarians, volunteers, and foster families to provide urgent medical care, temporary shelter, and loving adoption support.
        <br><br>
        Our goal is simple yet powerful — to give every living being in need a second chance at life and dignity.
      </p>
    </div>
  </div>
  
  <!-- Bruno & Luna Intro Section -->
  <section class="intro-container" id="bruno">
    <img src="assets/images/bruno.jpg" alt="Bruno the dog" />
    <div class="story-center">
      <h2>Bruno's Journey</h2>
      <p>
        Bruno was found wandering the busy streets of Mumbai’s Dadar area, limping badly with a hurt paw and covered in mud. A team from Happy Paws NGO spotted him during their routine patrol. He was dehydrated but had a gentle spirit. The volunteers quickly brought Bruno to their rescue center where he received immediate care and lots of love. Now fully recovered, Bruno loves playing with kids and has become the official mascot of the Happy Paws shelter.
      </p>
    </div>
  </section>
  <section class="intro-container" id="luna">
    <div class="story-center">
        <h2>Luna's Journey</h2>
        <p>
          Luna was found curled up under a broken cart during the monsoon in Kolkata’s bustling Howrah Market. 
          Soaked to the bone and trembling with fear, she avoided human contact for days. But volunteers from <strong>Happy Paws</strong> patiently offered food and shelter, slowly gaining her trust.
        
          After days of gentle care, Luna finally wagged her tail and stepped into the safety of the rescue van. 
          Today, Luna has blossomed into a friendly, playful soul. She loves squeaky toys and cuddles, and greets 
          every visitor at the shelter with a cheerful bark.
        </p>
        </div>
    <img src="assets/images/luna.jpg" alt="Luna the cat" />
  </section>
  
  <!-- Slider of Rescue Pets -->
  <section class="slider-section">
    <h2>Rescue Animals Gallery</h2>
    <div class="slider-container">
      <div class="slide-item" data-info="Bella was rescued from flood waters in Assam. She loves belly rubs!">
        <img src="assets/images/rescue1.jpeg" alt="Bella" />
      </div>
      <div class="slide-item" data-info="Max survived a fire in Chennai. Now he’s a couch king.">
        <img src="assets/images/rescue3.jpg" alt="Max" />
      </div>
      <div class="slide-item" data-info="Chloe was abandoned near a market in Delhi. She loves chasing butterflies.">
        <img src="assets/images/rescue2.jpg" alt="Chloe" />
      </div>
      <div class="slide-item" data-info="Rocky was rescued from an abusive home in Pune. A true fighter!">
        <img src="assets/images/rescue4.jpg" alt="Rocky" />
      </div>
      <div class="slide-item" data-info="Milo was found starving on the streets of Kolkata. Now he’s thriving.">
        <img src="assets/images/rescue5.jpg" alt="Milo" />
      </div>
      <div class="slide-item" data-info="Luna was saved from a traffic accident in Hyderabad. She’s a gentle soul.">
        <img src="assets/images/rescue6.jpg" alt="Luna" />
      </div>
      <div class="slide-item" data-info="Oscar was caught in a storm in Goa. Now he loves the sunshine.">
        <img src="assets/images/rescue7.jpg" alt="Oscar" />
      </div>
      <div class="slide-item" data-info="Sadie was found abandoned in Jaipur. She’s the sweetest companion.">
        <img src="assets/images/rescue8.jpg" alt="Sadie" />
      </div>
      <div class="slide-item" data-info="Toby was rescued from a forest fire in Uttarakhand. Brave little pup.">
        <img src="assets/images/rescue9.jpg" alt="Toby" />
      </div>
      <div class="slide-item" data-info="Zoe was caught in heavy rains in Bhopal. She’s now a happy family member.">
        <img src="assets/images/rescue10.jpg" alt="Zoe" />
      </div>
      <div class="slide-item" data-info="Daisy was rescued from a cruel owner in Surat. She loves belly scratches.">
        <img src="assets/images/rescue11.jpg" alt="Daisy" />
      </div>
      <div class="slide-item" data-info="Leo was trapped under debris in Lucknow. Now he’s full of energy.">
        <img src="assets/images/rescue13.jpg" alt="Leo" />
      </div>
      <div class="slide-item" data-info="Sophie was abandoned near a temple in Varanasi. Loving and playful.">
        <img src="assets/images/rescue12.jpg" alt="Sophie" />
      </div>
      <div class="slide-item" data-info="Jake was rescued from flood waters in Assam. Very friendly and calm.">
        <img src="assets/images/rescue14.jpg" alt="Jake" />
      </div>
    </div>
  </section>

  <section id="video" class="iframe-section">
    <h2>Watch Our Rescue in Action</h2>
    <div class="iframe-container">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/BgxGOO1GiW4?si=mogesIReO5c5cjKX" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>
  </section>
  
  <div class="intro-container">
    <h2 style="color: white; text-align: center;">Find Rescue Centres in India</h2>
    <iframe src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1022392.009959479!2d86.74477093258066!3d23.594498385555816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sanimal%20rescue%20center%20!5e0!3m2!1sen!2sin!4v1752880700360!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  </div>

  <!-- Report Form -->
  <section id="form-section">
    <h2>Report an Animal in Need</h2>
    <form id="rescueForm" action="report_submit.php" method="POST">
      
      <label>Pinpoint Location on Map:</label>
      <div id="report-map" style="height: 300px; width: 100%; border-radius: 8px; margin-bottom: 5px; z-index: 1;"></div>
      <p style="font-size: 0.85em; color: #aaa; margin-top: 0; margin-bottom: 15px;">Click on the map to set the exact location.</p>
      
      <input type="hidden" name="latitude" id="latitude" />
      <input type="hidden" name="longitude" id="longitude" />
      
      <label for="animalType">Type of Animal:</label>
      <input type="text" name="animalType" id="animalType" required />

      <label for="location">Location Description:</label>
      <input type="text" name="location" id="location" placeholder="e.g., Near the main gate" required />

      <label for="contact">Contact Number:</label>
      <input type="tel" name="contact" id="contact" required />

      <label for="rescuer">Rescuer Name:</label>
      <input type="text" name="rescuer" id="rescuer" required />

      <label for="info">More Info:</label>
      <textarea name="info" id="info" rows="4"></textarea>

      <p>Urgency:</p>
      <label><input type="radio" name="urgency" value="High" required /> High</label>
      <label><input type="radio" name="urgency" value="Medium" /> Medium</label>
      <label><input type="radio" name="urgency" value="Low" /> Low</label>

      <button type="submit">Submit</button>
    </form>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        if(document.getElementById('report-map')) {
          var map = L.map('report-map').setView([20.5937, 78.9629], 4);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          var marker;
          map.on('click', function(e) {
              var lat = e.latlng.lat;
              var lng = e.latlng.lng;
              
              if(marker) {
                  map.removeLayer(marker);
              }
              marker = L.marker([lat, lng]).addTo(map);
              
              document.getElementById('latitude').value = lat;
              document.getElementById('longitude').value = lng;
          });
          
          if(navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(pos) {
                  var lat = pos.coords.latitude;
                  var lng = pos.coords.longitude;
                  map.setView([lat, lng], 13);
              });
          }
        }
      });
    </script>
  </section>
  
  <!-- Adoption -->
  <button type="button" id="adoption" onclick="location.href='adoption.php'">Go to adoption page</button>

<div id="chat-widget" style="position:fixed;bottom:30px;right:30px;z-index:999;">
  <button onclick="toggleChat()" style="background:#ff6b6b;color:#fff;border:none;border-radius:50%;width:60px;height:60px;font-size:2rem;box-shadow:0 2px 10px #0006;cursor:pointer;">💬</button>
  <div id="chat-box" style="display:none;background:#222;color:#fff;padding:15px;border-radius:12px;box-shadow:0 2px 10px #000a;margin-top:10px;width:250px;">
    <strong>Chat with us!</strong>
    <div id="chatHistory" style="max-height:120px;overflow-y:auto;margin-bottom:8px;font-size:0.98em;"></div>
    <input type="text" id="chatInput" placeholder="Type your message..." style="width:100%;margin-top:10px;padding:6px;border-radius:6px;border:none;">
    <button onclick="sendChat()" style="margin-top:8px;background:#ff6b6b;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;">Send</button>
    <div id="chatResponse" style="margin-top:10px;font-size:0.95em;"></div>
  </div>
</div>

  <script src="assets/script.js"></script>
  
  <!-- Stats Section -->
  <section id="stats-section">
    <h2>Animal Rescue Statistics in India</h2>
    <table>
      <thead>
        <tr>
          <th>Year</th>
          <th>Animals Rescued</th>
          <th>NGOs Involved</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>2022</td><td>12,500+</td><td>100+</td></tr>
        <tr><td>2023</td><td>14,700+</td><td>120+</td></tr>
      </tbody>
    </table>
  </section>
  <nav class="navbar">
    <ul>
      <a href="#luna" style="color: white">Luna's Story</a></li>
      <a href="#bruno" style="color: white">Bruno's Story</a></li>
      <a href="#video" style="color: white">Watch Rescue Video</a></li>
    </ul>
  </nav>
  <section  class="partners-section">
    <h2>NGOs We Work With</h2>
      <a href="https://www.peopleforanimalsindia.org/" target="_blank">
        <p style="color: rgb(255, 72, 0)">People for Animals (PFA)</p>
      </a>
      <a href="https://bluecrossofindia.org/" target="_blank">
        <p style="color: rgb(255, 72, 0)">Blue Cross of India</p>
      </a>
      <a href="https://www.therescueproject.org/" target="_blank">
        <p style="color: rgb(255, 72, 0)">The Rescue Project</p>
      </a>
  </section>
  
  <footer>
    <span>Made with ❤️ by Team RescueForce</span>
  </footer>
</body>
</html>
