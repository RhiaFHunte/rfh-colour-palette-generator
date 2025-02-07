class Colour {
   constructor(hex, element) {
      this.hex = hex;
      this.element = element;
      this.locked = false;

      const storedLockState = localStorage.getItem(`colour-${this.hex}-locked`);
      if (storedLockState === "true") {
         this.setLocked(true);
      }
   }

   setHex(hex) {
      this.hex = hex;
      this.element.style.backgroundColor = hex;
      this.element.querySelector('.colour-input').value = hex;
   }

   setLocked(locked) {
      this.locked = locked;
      // Save lock state to localStorage
      localStorage.setItem(`colour-${this.hex}-locked`, locked);

      if (locked) {
         this.element.querySelector(".lock-toggle").classList.add("is-locked");
         this.element.querySelector("img").src = "icons/lock-closed.svg";
      } else {
         this.element.querySelector(".lock-toggle").classList.remove("is-locked");
         this.element.querySelector("img").src = "icons/lock-open.svg";
      }
   }

   toggleLocked() {
      this.setLocked(!this.locked);
   }

   generateHex() {
      if (this.locked) return;  

      const chars = '0123456789ABCDEF';
      let hex = '#';

      for (let i = 0; i < 6; i++) {
         hex += chars[Math.floor(Math.random() * 16)];
      }

      this.setHex(hex);
   }

   copyToClipboard() {
      const input = this.element.querySelector('.colour-input');
   
      // Clipboard API to copy HEX
      navigator.clipboard.writeText(input.value)
         .then(() => {
            // Show the "Copied" message 
            const copyButton = this.element.querySelector('.copy-hex');
            copyButton.textContent = 'Copied!';  // Change button text to "Copied"
   
            setTimeout(() => {
               copyButton.textContent = 'Copy';
            }, 1500);
         })
         .catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy!');  // Shows error messag
         });
   }

}

const colour_elements = document.querySelectorAll('.colours .colour');
const colours = [];

for (let i = 0; i < colour_elements.length; i++) {
   const colour_element = colour_elements[i];
   const input = colour_element.querySelector('.colour-input');
   const lock_toggle = colour_element.querySelector('.lock-toggle');
   const copy_hex = colour_element.querySelector('.copy-hex');

   const hex = input.value;

   const colour = new Colour(hex, colour_element);

   input.addEventListener('input', (e) => colour.setHex(e.target.value));
   lock_toggle.addEventListener('click', () => colour.toggleLocked());
   copy_hex.addEventListener('click', () => colour.copyToClipboard());

   colour.generateHex();

   colours.push(colour);
}


// Prevent spacebar from unlocking any locks
document.addEventListener('keydown', (e) => {
   if (e.code.toLowerCase() === "space") {
      // Prevent default behavior of spacebar (which could be scrolling)
      e.preventDefault();

      // Generate colors only for unlocked colors
      for (let i = 0; i < colours.length; i++) {
         if (!colours[i].locked) {
            colours[i].generateHex();
         }
      }
   }
});

// Re-generate all colors when the generator button is clicked
document.querySelector(".generator-button").addEventListener("click", () => {
   for (let i = 0; i < colours.length; i++) {
      // Only generate new hex if the color is not locked
      if (!colours[i].locked) {
         colours[i].generateHex();
      }
   }
});

// Dark Mode toggle function
const darkModeToggle = document.getElementById('darkmode-toggle');
const themeIcon = document.getElementById('theme-icon');
const savedDarkMode = localStorage.getItem('darkMode') === 'true';

// Apply dark mode on page load if saved
if (savedDarkMode) {
   document.body.classList.add('dark-mode');
   darkModeToggle.checked = true;
}

// Toggle dark mode and save preference
darkModeToggle.addEventListener('change', () => {
   if (darkModeToggle.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
   } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
   }
});
