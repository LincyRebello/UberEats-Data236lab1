import React, { useRef } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/MainContent.css';

import bakeryIcon from '../../images/croissan.png';
import pizzaIcon from '../../images/italian-pizza.png';
import hotdogIcon from '../../images/hotdog.png';
import koreanIcon from '../../images/ramen.png';  
import saladIcon from '../../images/salad.png';  
import breakfastIcon from '../../images/pancake.png';  
import sandwichIcon from '../../images/sandwich.png';  
import MexicanIcon from '../../images/taco.png';  
import italianIcon from '../../images/pasta.png';
import burgerIcon from '../../images/burger.png';
import carrebianIcon from '../../images/carrebian.png';
import drinkIcon from '../../images/drink.png';
import friesIcon from '../../images/fries.png';  
import groceryIcon from '../../images/grocery.png';  
import IcecreamIcon from '../../images/ice-cream.png';  
import japneseIcon from '../../images/japnese.png';  
import packageIcon from '../../images/package.png';  
import seafoodIcon from '../../images/seafood.png';
import sushiIcon from '../../images/sushi.png';  
import wineIcon from '../../images/wine.png';  
import wingaIcon from '../../images/winga.png';

import cofeeIcon from '../../images/coffee.png';  
import fruitIcon from '../../images/fruit.png';
import smoothieIcon from '../../images/smoothie.png';  
import soupIcon from '../../images/soup.png';  
import healthyIcon from '../../images/healthy.png';

const MainContent = () => {
  const categories = [
    { name: 'Burger', icon: burgerIcon },
    { name: 'Caribbean', icon: carrebianIcon },
    { name: 'Drinks', icon: drinkIcon },
    { name: 'Fast Food', icon: friesIcon },
    { name: 'Grocery', icon: groceryIcon },
    { name: 'Dessert', icon: IcecreamIcon },
    { name: 'Japanese', icon: japneseIcon },
    { name: 'Italian', icon: italianIcon },
    { name: 'Box Catering', icon: packageIcon },
    { name: 'Seafood', icon: seafoodIcon },
    { name: 'Sushi', icon: sushiIcon },
    { name: 'Alcohol', icon: wineIcon },
    { name: 'Wings', icon: wingaIcon },
    { name: 'Bakery', icon: bakeryIcon },
    { name: 'Pizza', icon: pizzaIcon },
    { name: 'American', icon: hotdogIcon },
    { name: 'Korean', icon: koreanIcon },
    { name: 'Salad', icon: saladIcon },
    { name: 'Breakfast', icon: breakfastIcon },
    { name: 'Sandwich', icon: sandwichIcon },
    { name: 'Mexican', icon: MexicanIcon },
    
    { name: 'Coffee', icon:cofeeIcon },
    { name: 'Fruits', icon: fruitIcon },
    { name: 'Smoothie', icon: smoothieIcon },
    { name: 'Soup', icon: soupIcon },
    { name: 'Healthy', icon: healthyIcon }
  ];

  const chunkSize = 13;
  const categoryChunks = [];
  for (let i = 0; i < categories.length; i += chunkSize) {
    categoryChunks.push(categories.slice(i, i + chunkSize));
  }

  const carouselRef = useRef(null);

  return (
    <div className="main-content-container position-relative">
      <Carousel ref={carouselRef} indicators={false} interval={null} controls={false}>
        {categoryChunks.map((chunk, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-center">
              {chunk.map((category) => (
                <div key={category.name} className="d-flex flex-column align-items-center mx-3">
                  <img 
                    src={category.icon} 
                    alt={category.name} 
                    className="carousel-icon"
                  />
                  <div className="text-center mt-2">{category.name}</div>
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Custom Navigation Buttons */}
      <button className="carousel-control-prev" onClick={() => carouselRef.current.prev()}>
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button className="carousel-control-next" onClick={() => carouselRef.current.next()}>
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>
  );
};

export default MainContent;