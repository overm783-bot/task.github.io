fetch('get_task.php')
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error(data.error);
      return;
    }

    // Получаем все контейнеры
    const containerA = document.getElementById('taskA');
    const containerB = document.getElementById('taskB');
    const containerC = document.getElementById('taskC');
    const btnA = document.getElementById("toggleBtnA");
    const btnB = document.getElementById("toggleBtnB");
    const btnC = document.getElementById("toggleBtnC");

    // Очищаем все контейнеры
    if (containerA) containerA.innerHTML = '';
    if (containerB) containerB.innerHTML = '';
    if (containerC) containerC.innerHTML = '';

    function updateLines() {
      const containers = [containerA, containerB, containerC];
      containers.forEach(container => {
        if (!container) return;
        const boxButton = container.previousElementSibling;
        const hasVisible = [...container.querySelectorAll('a')].some(el => el.offsetParent !== null);
        boxButton.classList.toggle("hide-line", !hasVisible);
      });
    }

    btnA.addEventListener("click", () => {
      containerA.classList.toggle("hidden");
      btnA.classList.toggle('rotated');
      updateLines();
    });
    btnB.addEventListener("click", () => {
      containerB.classList.toggle("hidden");
      btnB.classList.toggle('rotated');
      updateLines();
    });
    btnC.addEventListener("click", () => {
      containerC.classList.toggle("hidden");
      btnC.classList.toggle('rotated');
      updateLines();
    });
    // Распределяем задачи по типам
    data.forEach(task => {
      // Создаем элемент задачи
      const taskLink = document.createElement('a');
      taskLink.href = `task1.html?id=${task.id}`;
      taskLink.style.textDecoration = 'none';
      taskLink.style.color = 'inherit';
      let EnableTaskText = "В процессе"

      // Добавляем класс если выполнено
      if (task.done) {
        taskLink.classList.add("done");
        EnableTaskText = "Выполнено";
      }

      // Массив с текстовыми значениями цветов
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000'];
      const links = ['bag.png' , 'Camera.png', 'Edit.png'];
      // Выбор рандомного элемента из массива
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomLink = links[Math.floor(Math.random() * links.length)];

      taskLink.innerHTML = `
        <div class="box1">
          <div class="circle" style="background-color: ${randomColor};">
          <img src="Обучение/Iconly/Regular/Bold/${randomLink}" alt="">
          </div>
          <div class="text-block">
            <span class="title">${task.name}</span>
          </div>
          <div class="text-block right" >
            <span class="right-text">
             ${task.completed}/${task.repeats}
             </span>
             <span class="right-text">
             ${EnableTaskText}
             </span>
          <div>
          
          
        </div>
      `;

      // Определяем в какой контейнер добавить задачу
      // Используем task.type, если есть, иначе по умолчанию 'a'
      const taskType = task.type || 'a';

      switch (taskType) {
        case 'A':
          if (containerA) containerA.appendChild(taskLink);
          break;
        case 'B':
          if (containerB) containerB.appendChild(taskLink);
          break;
        case 'C':
          if (containerC) containerC.appendChild(taskLink);
          break;
        default:
          if (containerA) containerA.appendChild(taskLink);
      }
    });

    updateLines();

    // Опционально: показываем сообщение если контейнер пуст
    [containerA, containerB, containerC].forEach(container => {
      if (container && container.children.length === 0) {
        container.innerHTML = '<div class="empty-message">Нет задач</div>';
      }
    });

  })
  .catch(error => {
    console.error('Ошибка загрузки задач:', error);
  });