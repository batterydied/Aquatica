import ProductPage from './components/ProductPage.js';
function App(){
    const root = document.getElementById('root');
    const productPage = ProductPage();
    root.appendChild(productPage);
}

App();
console.log("heyyy");