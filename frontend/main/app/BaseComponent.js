export class BaseComponent {
   constructor() {
      this.container = document.createElement('div'); // Each component has its own container
      this.cssLoaded = false; // Tracks if CSS for a component has been loaded
   }
 
   render() {
      throw new Error('Render method must be implemented in subclasses');
   }

   // Loads CSS dynamically, specific to each component
   loadCSS(fileName) {
      if (this.cssLoaded) return; // Prevents reloading the same CSS file
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `./main/components/${fileName}/${fileName}.css`; // Assumes the file path
      document.head.appendChild(link);
      this.cssLoaded = true;
   }
}
