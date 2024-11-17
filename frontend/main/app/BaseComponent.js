export class BaseComponent {
   constructor() {
      this.container = document.createElement('div'); // Each component has its own container
      this.cssLoaded = false; // Tracks if CSS for a component has been loaded
   }
 
   render() {
      throw new Error('Render method must be implemented in subclasses');
   }

  loadCSS(fileName) {
    if (this.cssLoaded) return; // Prevents loading the same CSS multiple times

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./main/components/${fileName}/${fileName}.css`; // Path to CSS file
    console.log(link.href);
    document.head.appendChild(link);
    this.cssLoaded = true; // Marks CSS as loaded
  }
}
