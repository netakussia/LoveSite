const canvas = document.getElementById("hearts-canvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

const hearts = []
const colors = ["#ffc0cb", "#ffb6c1", "#ff69b4", "#ff4d6d", "#c94fcf", "#ffccd5"]

function createHeart() {
  const size = Math.random() * 20 + 10
  hearts.push({
    x: Math.random() * canvas.width,
    y: canvas.height + size,
    size,
    speed: Math.random() * 1 + 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: Math.random() * 0.5 + 0.5
  })
}

function drawHeart(h) {
  ctx.globalAlpha = h.opacity
  ctx.beginPath()
  const topCurveHeight = h.size * 0.3
  ctx.moveTo(h.x, h.y)
  ctx.bezierCurveTo(h.x - h.size / 2, h.y - topCurveHeight,
                    h.x - h.size, h.y + h.size / 2,
                    h.x, h.y + h.size)
  ctx.bezierCurveTo(h.x + h.size, h.y + h.size / 2,
                    h.x + h.size / 2, h.y - topCurveHeight,
                    h.x, h.y)
  ctx.fillStyle = h.color
  ctx.fill()
  ctx.globalAlpha = 1
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < hearts.length; i++) {
    const h = hearts[i]
    h.y -= h.speed
    drawHeart(h)
  }
  while (hearts.length < 30) createHeart()
  requestAnimationFrame(animate)
}

animate()










const loaderText = document.getElementById("loaderText")
const phrases = [
  "Загрузка любви...",
  "Связываемся с сердцем...",
  "Ожидаем поцелуй...",
  "Синхронизация воспоминаний...",
  "Подключение к любимой...",
  "Анализ обнимашек...",
  "Обновление чувств...",
  "Кэшируем нежность...",
  "Запуск бабочек в животе...",
  "Шифруем взгляды...",
  "Устанавливаем связь душ...",
  "Обнаружена любовь — соединяем...",
  "Инициализация романтики...",
  "Передаём тепло касаний...",
  "Подготовка сюрпризов...",
  "Вспоминаем первые «я тебя люблю»...",
  "Сохраняем моменты счастья..."
]

let index = 0

const changeText = () => {
  loaderText.textContent = phrases[index]
  index = (index + 1) % phrases.length
}

const preloader = document.getElementById("preloader")

// Меняем текст каждые 1.5 секунды
const interval = setInterval(changeText, 300)

// Прячем прелоадер через 5.5 секунд
window.addEventListener("load", () => {
  setTimeout(() => {
    preloader.style.opacity = "0"
    setTimeout(() => {
      preloader.style.display = "none"
      clearInterval(interval)
    }, 5000)
  }, 5000)
})




function updateDayCounter() {
  const counter = document.getElementById("dayCounter");
  // Укажи дату начала (год, месяц-1, день)
  const startDate = new Date(2025, 4, 3); // 16 июня 2024 (месяцы с нуля!)
  const now = new Date();
  // Считаем разницу в днях
  const diffTime = now - startDate;
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 чтобы включить первый день
  counter.textContent = `${days} ${pluralizeDays(days)}`;
}

function pluralizeDays(n) {
  if (n % 10 === 1 && n % 100 !== 11) return "день"
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "дня"
  return "дней"
}

updateDayCounter()








const chatMessages = document.getElementById("chat-messages");
const typingIndicator = document.getElementById("typing-indicator");

const messages = [
  "Привет, любовь моя ❤️",
  "Знаешь, я хотел бы начать этот сайт с чего-то простого, но настоящего",
  "Ты — причина, по которой я улыбаюсь без причины 🥺",
  "Спасибо за эти чудесные 3 месяца 🌸",
  "А теперь... погнали дальше 😉",
  "Ты — моя вселенная в человеческом виде ✨",
  "Каждая минута с тобой — как отдельная глава сказки 📖",
  "Иногда я просто сижу и думаю, как же мне повезло с тобой 🥹",
  "Если бы я мог, я бы закрыл тебя в объятиях навсегда 🤍",
  "У нас ещё столько впереди... и всё это — вместе 🤝",
  "Даже в плохие дни ты — моё самое светлое 🌙",
  "Люблю тебя так, что слова не справляются 💬❤️",
  "Этот сайт — не просто сюрприз, а отражение моей любви к тебе 💌"
];


let chatStarted = false;

function showTyping(message, callback) {
  typingIndicator.style.display = "block";
  const delay = 50 * message.length + 1000;

  setTimeout(() => {
    typingIndicator.style.display = "none";
    const msg = document.createElement("div");
    msg.className = "message bot";
    msg.textContent = message;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    callback();
  }, delay);
}

function startChat() {
  if (chatStarted) return;
  chatStarted = true;

  let index = 0;
  function next() {
    if (index < messages.length) {
      showTyping(messages[index], () => {
        index++;
        next();
      });
    }
  }
  next();
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}

document.addEventListener("scroll", () => {
  const chatSection = document.getElementById("chat-section");
  if (isInViewport(chatSection)) {
    startChat();
  }
});



  const timelineItems = document.querySelectorAll('.timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  timelineItems.forEach(item => observer.observe(item));











function toggleGift() {
  const gift = document.querySelector('.gift-wrapper')
  const popup = document.getElementById('giftPopup')

  if (gift.classList.contains('open')) {
    gift.classList.remove('open')
    popup.classList.add('hidden')
  } else {
    gift.classList.add('open')
    popup.classList.remove('hidden')
  }
}



const giftBtn = document.getElementById('gift-open-btn');
const passwordContainer = document.getElementById('password-container');
const submitPasswordBtn = document.getElementById('submit-password');
const giftPasswordInput = document.getElementById('gift-password');
const errorMessage = document.getElementById('error-message');
const giftMessage = document.getElementById('gift-message');
const confettiCanvas = document.getElementById('confetti-canvas');

const correctPassword = 'сучка'; // Твой пароль
let confettiStarted = false;

giftBtn.addEventListener('click', () => {
  giftBtn.style.display = 'none';
  passwordContainer.style.display = 'block';
  giftPasswordInput.focus();
});

submitPasswordBtn.addEventListener('click', () => {
  const entered = giftPasswordInput.value.trim();

  if (entered === correctPassword) {
    errorMessage.style.display = 'none';
    passwordContainer.style.display = 'none';
    showGiftMessage();
  } else {
    errorMessage.textContent = 'Не те букавки солнышко, попробуй ещё☺️';
    errorMessage.style.display = 'block';
    shake(passwordContainer);
  }
});

function shake(element) {
  element.style.animation = 'shake 0.4s';
  element.addEventListener('animationend', () => {
    element.style.animation = '';
  }, { once: true });
}

function showGiftMessage() {
  giftMessage.style.display = 'block';
  if (!confettiStarted) {
    confettiStarted = true;
    startConfetti();
  }
}

function startConfetti() {
  confettiCanvas.style.display = 'block';
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const confettiPieces = [];
  const colors = ['#ff9aa2', '#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea'];

  for (let i = 0; i < 50; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      size: Math.random() * 10 + 5,
      speedY: Math.random() * 3 + 1.5,
      speedX: (Math.random() - 0.5) * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 6,
      opacity: 1,
      decay: Math.random() * 0.005 + 0.002,  // скорость затухания
    });
  }

  let animationFrameId;
  let confettiTime = 0;
  const maxConfettiTime = 8000; // показывать конфети 8 секунд

  function draw() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiTime += 16;

    confettiPieces.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0) {
        // перезапускаем сверху
        p.x = Math.random() * confettiCanvas.width;
        p.y = 0;
        p.opacity = 1;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      // вместо квадратика сделаем стильный ромб
      ctx.beginPath();
      ctx.moveTo(0, -p.size / 2);
      ctx.lineTo(p.size / 2, 0);
      ctx.lineTo(0, p.size / 2);
      ctx.lineTo(-p.size / 2, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    if (confettiTime < maxConfettiTime) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiCanvas.style.display = 'none';
      cancelAnimationFrame(animationFrameId);
    }
  }

  draw();
}

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Плавное появление кнопки
  themeToggle.classList.add('hide');
  setTimeout(() => {
    themeToggle.classList.remove('hide');
  }, 100);

  function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    themeToggle.textContent = mode === 'dark' ? '☀️' : '🌙';
  }

  // Начальная установка темы
  let theme = localStorage.getItem('theme');
  if (theme !== 'dark' && theme !== 'light') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  setTheme(theme);

  themeToggle.addEventListener('click', (e) => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    // Анимация кругового перехода
    const circle = document.createElement('div');
    circle.className = 'theme-transition-circle';
    const rect = themeToggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + window.scrollX;
    const y = rect.top + rect.height / 2 + window.scrollY;
    circle.style.setProperty('--theme-circle-x', `${x}px`);
    circle.style.setProperty('--theme-circle-y', `${y}px`);
    circle.style.setProperty('--theme-transition-bg', next === 'dark' ? '#2a0036' : '#ffe4f1');
    document.body.appendChild(circle);

    setTimeout(() => {
      setTheme(next);
      localStorage.setItem('theme', next);
    }, 400); // чуть дольше для плавности

    circle.addEventListener('animationend', () => {
      circle.remove();
    });
  });
});

// --- Только для мобильных: раскрытие миниатюр timeline по тапу на картинку ---
if (window.innerWidth <= 700) {
  document.querySelectorAll('.moment-popup-img-wrap').forEach(imgWrap => {
    imgWrap.addEventListener('click', function (e) {
      e.stopPropagation();
      const item = imgWrap.closest('.timeline-item');
      // Закрыть все остальные
      document.querySelectorAll('.timeline-item.open').forEach(opened => {
        if (opened !== item) opened.classList.remove('open');
      });
      // Переключить текущую
      item.classList.toggle('open');
    });
  });
  // Если клик вне timeline — всё свернуть
  document.body.addEventListener('click', function (e) {
    if (!e.target.closest('.timeline-item')) {
      document.querySelectorAll('.timeline-item.open').forEach(opened => {
        opened.classList.remove('open');
      });
    }
  });
}

// --- Мобильный полноэкранный просмотр фото timeline ---
if (window.innerWidth <= 700) {
  document.querySelectorAll('.moment-popup-img-wrap img').forEach(img => {
    img.addEventListener('click', function (e) {
      e.stopPropagation();
      // Создать оверлей
      const overlay = document.createElement('div');
      overlay.className = 'timeline-photo-fullscreen';
      // Клонируем картинку
      const bigImg = document.createElement('img');
      bigImg.src = img.src;
      bigImg.alt = img.alt || '';
      overlay.appendChild(bigImg);
      // Кнопка закрытия
      const closeBtn = document.createElement('button');
      closeBtn.className = 'timeline-photo-fullscreen-close';
      closeBtn.innerHTML = '✕';
      overlay.appendChild(closeBtn);

      // Закрытие по кнопке или по клику на фон
      function closeOverlay() {
        overlay.remove();
        document.body.style.overflow = '';
      }
      closeBtn.addEventListener('click', closeOverlay);
      overlay.addEventListener('click', function (ev) {
        if (ev.target === overlay) closeOverlay();
      });
      // Отключаем скролл body
      document.body.style.overflow = 'hidden';
      document.body.appendChild(overlay);
    });
  });
}

// --- Предложение: "Да" и убегающая "Нет" ---
document.addEventListener("DOMContentLoaded", () => {
  // Proposal logic
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const ringImg = document.getElementById('ring-img');
  const msgAbove = document.getElementById('gift-message-above');
  const giftPopup = document.getElementById('giftPopup');
  const proposalBtns = document.querySelector('.proposal-buttons');

  // "Да" — показать надпись и кольцо
  if (yesBtn && noBtn && ringImg && msgAbove) {
    yesBtn.addEventListener('click', function (e) {
      msgAbove.textContent = "Официально — ты моя жена в душе 💍";
      msgAbove.classList.add('active');
      ringImg.classList.add('active');
    });

    // "Нет" — убегает
    let noBtnMoving = false;
    function moveNoBtn(e) {
      if (window.innerWidth <= 600) return; // на мобилке не убегает
      if (noBtnMoving) return;
      noBtnMoving = true;
      const parent = proposalBtns;
      const btnRect = noBtn.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const maxLeft = parentRect.width - btnRect.width - 8;
      const maxTop = parentRect.height - btnRect.height - 8;
      // Случайная позиция в пределах контейнера
      let left = Math.random() * maxLeft;
      let top = Math.random() * maxTop;
      // Не слишком близко к текущей позиции
      left = Math.max(0, Math.min(left, maxLeft));
      top = Math.max(0, Math.min(top, maxTop));
      noBtn.style.position = 'absolute';
      noBtn.style.left = left + "px";
      noBtn.style.top = top + "px";
      noBtn.style.transform = `scale(1.05) rotate(${Math.random() * 10 - 5}deg)`;
      setTimeout(() => { noBtnMoving = false; }, 250);
    }
    noBtn.addEventListener('mouseenter', moveNoBtn);
    noBtn.addEventListener('touchstart', moveNoBtn);

    // Сброс позиции при ресайзе/открытии
    function resetNoBtn() {
      if (window.innerWidth <= 600) {
        noBtn.style.position = '';
        noBtn.style.left = '';
        noBtn.style.top = '';
        noBtn.style.transform = '';
      }
    }
    window.addEventListener('resize', resetNoBtn);
    resetNoBtn();
  }
});










