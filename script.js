// Словарь цветов (рус → CSS)
const C = {
  красный: 'red',
  синий: 'blue',
  зелёный: 'green',
  жёлтый: 'yellow',
  чёрный: 'black',
  белый: 'white',
  оранжевый: 'orange',
  фиолетовый: 'purple',
  голубой: 'lightblue',
  розовый: 'pink',
  серый: 'gray'
};

// Список команд для подсказок
const CMDS = [
  'название [текст]',
  'фон [цвет]',
  'цвет [цвет]',
  'шрифт [имя]',
  'размер [Npx]',
  'заголовок [текст]',
  'параграф [текст]',
  'картинка [ссылка]',
  'ссылка [текст] [адрес]',
  'видео [ссылка]'
];

// Получение элементов DOM
const I = document.getElementById('i');      // textarea ввода
const S = document.getElementById('s');      // контейнер подсказок
const O = document.getElementById('o');      // область вывода HTML
const DB = document.getElementById('db');    // кнопка «Скачать»

// Обработчик ввода: показывает подсказки
I.addEventListener('input', () => {
  const v = I.value.trim().toLowerCase().split('\n').pop();
  if (!v) {
    S.style.display = 'none';
    return;
  }
  
  // Фильтруем команды, содержащие введённый фрагмент
  const matches = CMDS.filter(c => c.toLowerCase().includes(v));
  
  // Формируем HTML подсказок
  S.innerHTML = matches.length
    ? matches.map(m => `<div class="si">${m.replace(v, `<span class="hl">${v}</span>`)}</div>`).join('')
    : '';
  
  // Показываем/скрываем подсказки
  S.style.display = matches.length ? 'block' : 'none';
});

// Функция генерации HTML
function generate() {
  const lines = I.value.split('\n');
  let title = 'Страница';        // <title>
  let bgColor = 'white';       // background
  let textColor = 'black';     // color
  let fontFamily = 'Arial';    // font-family
  let fontSize = '16px';     // font-size
  let bodyContent = '';        // содержимое <body>

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('название ')) {
      title = trimmed.slice(9);
    } else if (trimmed.startsWith('фон ')) {
      bgColor = C[trimmed.slice(4)] || trimmed.slice(4);
    } else if (trimmed.startsWith('цвет ')) {
      textColor = C[trimmed.slice(5)] || trimmed.slice(5);
    } else if (trimmed.startsWith('шрифт ')) {
      fontFamily = trimmed.slice(6);
    } else if (trimmed.startsWith('размер ')) {
      fontSize = trimmed.slice(7);
    } else if (trimmed.startsWith('заголовок ')) {
      bodyContent += `<h1>${trimmed.slice(9)}</h1>\n`;
    } else if (trimmed.startsWith('параграф ')) {
      bodyContent += `<p>${trimmed.slice(8)}</p>\n`;
    } else if (trimmed.startsWith('картинка ')) {
      const src = trimmed.slice(8).trim();
      bodyContent += `<img src="${src}" alt="Изображение" style="max-width:100%;height:auto;margin:10px 0;">\n`;
    } else if (trimmed.startsWith('ссылка ')) {
      const parts = trimmed.slice(7).trim().split(' ');
      const text = parts[0];
      const href = parts.slice(1).join(' ') || '#';
      bodyContent += `<a href="${href}" target="_blank" style="color:#8b5cf6;text-decoration:underline;">${text}</a>\n`;
    } else if (trimmed.startsWith('видео ')) {
      const url = trimmed.slice(6).trim();
      let embedUrl = url;
      
      // Для YouTube преобразуем в embed-ссылку
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      
      bodyContent += `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen style="margin:10px 0;"></iframe>\n`;
    }
  }

  // Формируем итоговый HTML
  O.textContent = `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>${title}</title>\n  <style>\n    body {\n      background: ${bgColor};\n      color: ${textColor};\n      font-family: ${fontFamily};\n      font-size: ${fontSize};\n      margin: 20px;\n    }\n  </style>\n</head>\n<body>\n${bodyContent}</body>\n</html>`;

  // Активируем кнопку скачивания
  DB.disabled = false;
}

// Функция скачивания HTML-файла
function downloadHTML() {
  const html = O.textContent;
  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'page.html';
  a.click();
  URL.revokeObjectURL(a.href);
}

// Функция очистки всех полей
function clearAll() {
  I.value = '';
  O.textContent = '';
  S.style.display = 'none';
  DB.disabled = true;
}
