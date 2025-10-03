# Farmer Harvest Game

## 📌 Overview
This is an extended version of the Farmer Harvest Game implemented in **modular ES6 JavaScript**.  
The game lets a farmer collect crops on a field within a time limit.  

---

## 🎮 Features
1. **Different crop types**  
   - Wheat = 1 point  
   - Pumpkin = 3 points  
   - Golden Apple = 5 points  

2. **Difficulty curve / Level system**  
   - Each level has different crop spawn rates, goals, and time limits.  
   - New obstacles (crows) appear as you progress.  

3. **Sprite-based Farmer (Graduate task)**  
   - Farmer uses a sprite sheet for movement animation.  
   - Falls back to a square if no sprite image is present.  

4. **Configurable difficulty**  
   - Level data (goal, time, spawn rate) is defined in code (or optionally in `config.json`).  

---

## ▶️ How to Run
### Option 1: Run with a Local Server (Recommended)
```bash
cd farmer-harvest-game
py -m http.server 8000
