document.addEventListener("DOMContentLoaded", () => {
    const decrease = document.getElementById("decrease");
    const increase = document.getElementById("increase");
    const repeatValue = document.getElementById("repeat-value");
    const taskCountInput = document.getElementById("taskCountInput");

    let count = 3;
    const min = 1;
    const max = 100;

    function updateDisplay() {
        repeatValue.textContent = count;
        taskCountInput.value = count; // синхронизируем с input
    }

    increase.addEventListener("click", () => {
        if (count < max) {
            count++;
            updateDisplay();
        }
    });

    decrease.addEventListener("click", () => {
        if (count > min) {
            count--;
            updateDisplay();
        }
    });

    updateDisplay();
});

async function addTask() {
    const name = document.getElementById("taskNameInput").value;
    const count = document.getElementById("taskCountInput").value;
    
    // Получаем выбранный тип (a, b или c)
    const typeInputs = document.querySelectorAll('input[name="taskType"]');
    let selectedType = 'a'; // значение по умолчанию
    
    // Ищем выбранную радио-кнопку
    for (const input of typeInputs) {
        if (input.checked) {
            selectedType = input.value;
            break;
        }
    }

    const response = await fetch("add.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            count: count,
            type: selectedType  // Добавляем тип в запрос
        })
    });

    const result = await response.json();
    console.log(result);

    if (result.success) {
        location.reload(); // обновляем страницу после добавления
        window.location.href = "index.html";
    }
}