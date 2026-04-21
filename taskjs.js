document.addEventListener('DOMContentLoaded', function () {


    const thumb = document.querySelector(".button-slider");
    const track = document.querySelector(".box-slider");

    let isDragging = false;
    let shiftX = 0;





    function getTaskIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id"); // вернёт, например, "6"
    }

    const taskId = getTaskIdFromURL();
    console.log("Загружена задача с id:", taskId);
    const button = document.getElementById("completed");

   
    button.dataset.id = taskId;

   

    async function loadTask() {
        const taskId = getTaskIdFromURL();

        const response = await fetch(`loadtask.php?id=${taskId}`);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        // подставляем данные в HTML
        document.getElementById("taskName").textContent = data.name;
        document.getElementById("taskCount").textContent = data.completed + " / " + data.repeats;
    }



    async function deleteTask() {
        const taskId = getTaskIdFromURL();

        const response = await fetch("delete.php", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: taskId })
        });

        const result = await response.json();

        if (result.success) {
            window.location.href = "index.html"; // редирект на список задач
        } else {
            alert(result.error);
        }
    }

    document.getElementById("deleteBtn").addEventListener("click", deleteTask);

    loadTask();

   

    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("completed")) {
            const id = e.target.dataset.id;

            const response = await fetch("compete.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            });

            console.log("clicked id:", id);

            const result = await response.json();

            console.log(result);

        // 👉 ВАЖНО: обновляем счётчик сразу
        if (result.completed !== undefined && result.repeats !== undefined) {
            document.getElementById("taskCount").textContent =
                result.completed + " / " + result.repeats;
        }

            // 1. если задача выполнена — красим UI
            if (result.done) {
                const btn = document.querySelector(".completed");
                if (btn) {
                    btn.disabled = true;
                    btn.textContent = "✔ DONE";
                    window.location.href = "index.html";
                   
                }
            }

            // 2. если лимит — СРАЗУ редирект
            if (result.limit) {
                window.location.href = "index.html";
                return;
            }

        }
    });

});

