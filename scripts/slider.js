const buttons = document.querySelectorAll('.placeholder-slider button');
const slidesWrapper = document.querySelector('.slides-wrapper');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const slideIndex = +button.getAttribute('data-slide');
    slidesWrapper.style.transform = `translateX(-${slideIndex * 1000}px)`;
  });
});
