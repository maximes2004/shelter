/*const selfAssessment = `Maximum score: 110 points. 110/110

Main page (70 points)

Markup validation - +10. 10/10
Markup is valid per https://validator.w3.org/. "Document checking completed. No errors or warnings to show." - full points. Warnings (no errors) - half points +5
The header logo is built from text elements, the page contains exactly one <h1>, and a favicon is added +5

Layout matches the design - +35. 35/35
<header> block +5
Not only block +5
About block +5
Our Friends block +5
Help block +5
In addition block +5
<footer> block +5

CSS requirements - +15. 15/15
The Help block is positioned using a grid layout (flexbox or grid) +5
When zooming out or widening the browser window (>1280px), the layout stays centered - it doesn't shift to the side or stretch to full width +5
The background color stretches across the full page width +5

Interactivity - +10. 10/10
The About the Shelter navigation item is highlighted and non-interactive; the other navigation items are interactive; smooth anchor scrolling works; and all page links behave per the Page links and navigation section +5
Each pet card in Our Friends is interactive when hovering over any area of the card; links and buttons have hover/active styling beyond cursor: pointer (color/background change); visual changes are smooth and do not affect neighboring elements +5

Pets page (40 points)

Markup validation - +10. 10/10
Markup is valid per https://validator.w3.org/ (same rules as for Main) +5
The header logo is built from text elements, the page contains exactly one <h1>, and a favicon is added +5

Layout matches the design - +15. 15/15
<header> block +5
Our Friends block +5
<footer> block +5

CSS requirements - +5. 5/5
When zooming out or widening the browser window (>1280px), the layout stays centered, and the background color stretches across the full page width +5

Interactivity - +10. 10/10
The Our pets navigation item is highlighted and non-interactive; the other navigation items are interactive; pagination buttons show correct enabled/disabled state; smooth anchor scrolling works; and all page links behave per the Page links and navigation section +5
Each pet card in Our Friends is interactive when hovering over any area of the card; links and buttons have hover/active styling beyond cursor: pointer; visual changes are smooth and do not affect neighboring elements +5`

console.log(selfAssessment);*/

import { initBurger } from "./burger.js";
import { initCarousel } from './carousel.js';
import { initPagination } from './pagination.js';
import { initPopup } from './popup.js';

// Запускаем инициализацию бургера
initBurger();

// Запускаем слайдер при загрузке страницы
initCarousel();

initPagination();

initPopup(); // Поп-ап готов слушать клики по карточкам из пагинации!

