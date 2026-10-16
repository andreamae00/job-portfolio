document.addEventListener('DOMContentLoaded', () => {
    const FRAME = 'assets/img/artwork-pola.png';

    // ---- mobile menu ----
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const open = links.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open);
        });
    }

    // ---- build the book popup once ----
    document.body.insertAdjacentHTML('beforeend', `
        <div id="modal" class="modal-book" hidden role="dialog" aria-modal="true" aria-labelledby="bookTitle">
            <button class="book-close" id="closeBtn" aria-label="Close">&times;</button>
            <div class="book-scroll">
                <div class="book">
                    <div class="page page-left">
                        <img class="frame-art" id="leftArt" src="" alt="">
                        <p class="page-caption" id="leftCaption"></p>
                    </div>
                    <div class="page page-right">
                        <img class="frame-bg" src="${FRAME}" alt="">
                        <div class="page-text"><h2 id="bookTitle"></h2><p id="bookDesc"></p></div>
                    </div>
                </div>
                <div class="book-nav">
                    <button id="prevBtn" type="button">&#8249; Previous</button>
                    <span id="counter" aria-live="polite"></span>
                    <button id="nextBtn" type="button">Next &#8250;</button>
                </div>
            </div>
        </div>`);

    const $ = (id) => document.getElementById(id);
    const modal = $('modal');
    const cards = [...document.querySelectorAll('.gallery .frame')];
    let current = 0;
    let lastFocus = null;

    function fill(i) {
        const card = cards[i];
        const title = card.dataset.title;
        $('leftArt').src = card.querySelector('.frame-art').src;
        $('leftCaption').textContent = `\u201C${title}\u201D`;
        $('bookTitle').textContent = title;
        $('bookDesc').textContent = card.dataset.desc || '';
        $('counter').textContent = `${i + 1} / ${cards.length}`;
        modal.classList.remove('is-open');   // restart the page-opening animation
        void modal.offsetWidth;
        modal.classList.add('is-open');
    }
    function openBook(i) {
        lastFocus = document.activeElement;
        current = i;
        fill(i);
        modal.hidden = false;
        document.body.classList.add('no-scroll');
        $('closeBtn').focus();
    }
    function closeBook() {
        modal.hidden = true;
        modal.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        if (lastFocus) lastFocus.focus();
    }
    function go(step) {
        current = (current + step + cards.length) % cards.length;
        fill(current);
    }

    cards.forEach((card, i) => card.addEventListener('click', () => openBook(i)));
    $('closeBtn').addEventListener('click', closeBook);
    $('prevBtn').addEventListener('click', () => go(-1));
    $('nextBtn').addEventListener('click', () => go(1));
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('book-scroll')) closeBook();
    });
    document.addEventListener('keydown', (e) => {
        if (modal.hidden) return;
        if (e.key === 'Escape') closeBook();
        else if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'ArrowRight') go(1);
        else if (e.key === 'Tab') {
            const f = [$('closeBtn'), $('prevBtn'), $('nextBtn')];
            const idx = f.indexOf(document.activeElement);
            e.preventDefault();
            f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
        }
    });
});
