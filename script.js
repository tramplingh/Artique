document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.artforms-slider');
    const track = slider.querySelector('.slider-track');
    const prevButton = slider.querySelector('.arrow-prev');
    const nextButton = slider.querySelector('.arrow-next');
    const viewport = slider.querySelector('.slider-viewport');
    
    if (!track || !prevButton || !nextButton) return;

    let items = Array.from(track.children);
    let isMoving = false;

    // --- 1. CLONE SLIDES FOR SEAMLESS LOOP ---
    const clonesCount = Math.floor(items.length / 2);
    const firstClones = items.slice(0, clonesCount).map(item => item.cloneNode(true));
    const lastClones = items.slice(-clonesCount).map(item => item.cloneNode(true));

    firstClones.forEach(clone => track.appendChild(clone));
    lastClones.reverse().forEach(clone => track.insertBefore(clone, items[0]));

    // Update the items array with all slides including clones
    items = Array.from(track.children);
    
    let currentIndex = clonesCount; // Start at the first "real" slide

    // --- 2. POSITIONING FUNCTION ---
    const setPosition = (index, withTransition = true) => {
        const viewportWidth = viewport.getBoundingClientRect().width;
        const targetItem = items[index];
        const itemWidth = targetItem.getBoundingClientRect().width;
        const targetLeft = targetItem.offsetLeft;

        // Correct logic to center the active item.
        const newTransform = (viewportWidth / 2) - (itemWidth / 2) - targetLeft;
        
        track.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform = `translateX(${newTransform}px)`;

        items.forEach(item => item.classList.remove('is-active'));
        items[index].classList.add('is-active');
    };

    // --- 3. EVENT LISTENERS ---
    nextButton.addEventListener('click', () => {
        if (isMoving) return;
        currentIndex++;
        setPosition(currentIndex);
        isMoving = true;
    });

    prevButton.addEventListener('click', () => {
        if (isMoving) return;
        currentIndex--;
        setPosition(currentIndex);
        isMoving = true;
    });

    // --- 4. SEAMLESS JUMP LOGIC ---
    track.addEventListener('transitionend', () => {
        isMoving = false;
        // Jump from the last clone group to the real last slide group
        if (currentIndex < clonesCount) {
            currentIndex = items.length - clonesCount - (clonesCount - currentIndex);
            setPosition(currentIndex, false);
        }
        // Jump from the first clone group to the real first slide group
        if (currentIndex >= items.length - clonesCount) {
            currentIndex = clonesCount + (currentIndex - (items.length - clonesCount));
            setPosition(currentIndex, false);
        }
    });

    // --- 5. INITIALIZE & RESIZE ---
    setPosition(currentIndex, false);

    window.addEventListener('resize', () => {
        setTimeout(() => {
            setPosition(currentIndex, false);
        }, 200);
    });
});