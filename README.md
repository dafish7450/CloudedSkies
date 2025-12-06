# 🌟 Highlights

- Easily Digestible Graphics
- Smooth Animation
- Parallax Scrolling
- Day/Night Cycle
- Procedural Generation
- Original Score

# ℹ️Overview

This is a meditative experience designed primarily around Perlin Noise and p5.js that simulates the flocking behavior of birds in a simplistic abstract way. My name is Reece Fish, I am a senior at the University of St. Thomas in Minnesota, and I am expecting to graduate in Spring of 2026! This project was my final project for my Creative Coding class (CISC 259), and showcases various principles, methods, and properties of software that I learned throughout the course. I focused this project primarily on Perlin Noise because I really enjoy randomness, and felt really connected to this specific algorithm. I used Perlin Noise to make just about everything on the canvas--I used it to create the flying path/arcs of the "birds", procedurally generate the trees and clouds in the background, and even used it to assemble the train that occasionally passes the screen on the bottom. I also utilized Tweakpane to allow some user interactivity, such as modifying the flight speed of the birds or the train, or even the total number of birds on the canvas. Finally, I composed my own music, and found sound effects for birds chirping, soft rain, and even a train horn. This program is designed to calm the user--while making this project, I bumped into an online study that talked about how tracing gently-moving objects on a screen can cause users to subconsiously relax, and even relieve stress. As I was feeling particularly stressed at that time, I figured I'd make something peaceful for both myself and others, which influenced the creation of this project. I really hope you enjoy this project just as much as I do!

# 🚀 Usage Instructions

This project heavily utilizes Perlin noise to procedurally generate assets and emulate movement. Here's an example: this is how Perlin noise influences the movement of the "birds".

```js
  x = createVector(
    random(cos(noise(-dist * cos(angle) * r1)), sin(noise(-dist * cw * cos(angle) * r1))),
    random(cos(noise(dist * sin(angle) * r1)), sin(noise(dist * cw * sin(angle) * r1)))
  );
  y = createVector(
    random(cos(noise(-dist * cos(angle + PI / 4) * r2)), sin(noise(-dist * ch * cos(angle + PI / 4) * r2))),
    random(cos(noise(dist * sin(angle + PI / 4) * r2 + ch / 2)), sin(noise(dist * c * sin(angle + PI / 4) * r2 + ch / 2)))
  );
```


As mentioned earlier, there is limited interactivity in this project; use the sliders in the upper right corner of the screen to modify the amount of "birds" present, modify their flight speed, or modify the train speed. Other than that, there's not much else to modify--so open the project up and enjoy!

This is what the project should look like upon proper opening:
![Screenshot of Start](https://github.com/dafish7450/SignatureWorkImages/blob/main/Screenshot%202025-12-06%20110350.png "Start Splash Screen")

This is what the project will start with, after clicking start (day cycle):
![Screenshot of Day](https://github.com/dafish7450/SignatureWorkImages/blob/main/Screenshot%202025-12-06%20110413.png "Day Cycle With Train")

This is what the project will look like during the night cycle: 
![Screenshot of Night](https://github.com/dafish7450/SignatureWorkImages/blob/main/Screenshot%202025-12-06%20110552.png "Night Cycle Without Train")

# ⬇️ Installation

For this project to run, you will need 3 things:

- Access to a Web Browser (Google Chrome, Firefox, Edge, etc.)
- Access to Visual Studio
- Live Server Extension installed in VS

Once you have both of those things, create a file in VS, copy these files into it, and click "Go Live" in the bottom right side of the window. The project should open on its own in your web browser, and from there, you just need to click the "Start" button to observe the project.
Should you run into any issues starting this project, you can try:

- Hovering over the .html file, right-clicking, and selecting "Open with Live Server"
- Going to File--> Preferences--> Settings--> Type "Live Server"--> Verify your host is set to local host (127.0.0.1)
- Going to File--> Preferences--> Settings--> Type "Live Server"--> Verify your browser is the default browser
