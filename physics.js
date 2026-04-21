document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ SCRIPT LOADED");

    const { Engine, Render, Runner, Bodies, World } = Matter;

    const worldElement = document.getElementById("world");
    if (!worldElement) return console.error("❌ #world не найден");

    const parent = worldElement.parentElement;
    let width = parent.clientWidth;
    let height = parent.clientHeight || 500;

    const engine = Engine.create();
    const world = engine.world;

    engine.positionIterations = 12;
    engine.velocityIterations = 10;

    const render = Render.create({
        element: worldElement,
        engine: engine,
        options: {
            width: width,
            height: height,
            wireframes: false,
            background: 'transparent'
        }
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);

    // ==================== СТЕНЫ РОВНО ПО ГРАНИЦЕ ====================
    const thickness = 80; // толстые, но полностью снаружи

    const wallOptions = {
        isStatic: true,
        render: { visible: false }
    };

    // Земля — точно по нижнему краю (стена снаружи)
    const ground = Bodies.rectangle(
        width / 2,
        height + thickness / 2,     // центр стены ниже видимой области
        width + 100,
        thickness,
        wallOptions
    );

    // Левая стенка — точно по левому краю
    const leftWall = Bodies.rectangle(
        -thickness / 2,             // центр стены левее видимой области
        height / 2,
        thickness,
        height + 200,
        wallOptions
    );

    // Правая стенка — точно по правому краю
    const rightWall = Bodies.rectangle(
        width + thickness / 2,      // центр стены правее видимой области
        height / 2,
        thickness,
        height + 200,
        wallOptions
    );

    World.add(world, [ground, leftWall, rightWall]);

    console.log(`📏 Стены установлены ИДЕАЛЬНО по границам ${width}×${height}`);

    // ==================== ФУНКЦИЯ ПОЛУЧЕНИЯ ЦВЕТА ПО ТИПУ ====================
    function getColorByType(type) {
        const colors = {
            'A': '#bc0505', 
            'B': '#ffea04', 
            'C': '#15cf21' 
        };
        return colors[type] || '#ee1111'; // по умолчанию красный
    }

    // ==================== ДИНАМИЧЕСКИЙ РАЗМЕР КУБИКОВ ====================
    let totalCubes = 0;

    // Сначала считаем общее количество кубов
    try {
        const res = await fetch('get_task.php');
        const data = await res.json();

        data.forEach(task => {
            const count = parseInt(task.completed) || 0;
            totalCubes += count;
        });

        console.log(`📊 Всего кубов на сцене: ${totalCubes}`);

    } catch (err) {
        console.error("❌ Ошибка:", err);
    }

    // Выбираем размер в зависимости от количества
    let cubeSize = 34;
    if (totalCubes > 60) {
        cubeSize = 22;
        console.log("🔽 Очень много кубов → размер уменьшен до 22px");
    } else if (totalCubes > 30) {
        cubeSize = 28;
        console.log("🔽 Много кубов → размер уменьшен до 28px");
    } else {
        console.log("✅ Нормальное количество → размер 34px");
    }

    // ==================== СПАВН КУБИКОВ ====================
    const cubeStyle = {
        strokeStyle: "#ffffff",
        lineWidth: 2,
        restitution: 0.20,
        friction: 0.98,
        density: 2
    };

    let spawnDelay = 0;
    let spawned = 0;
    const typeStats = { a: 0, b: 0, c: 0 }; // статистика по типам

    try {
        const res = await fetch('get_task.php');
        const data = await res.json();

        data.forEach((task, taskIndex) => {
            const count = parseInt(task.completed) || 0;
            if (count === 0) return;

            const taskType = task.type || 'a'; // получаем тип задачи
            const cubeColor = getColorByType(taskType); // определяем цвет

            // Обновляем статистику
            typeStats[taskType] = (typeStats[taskType] || 0) + count;

            // Размер куба в зависимости от типа (с учётом общего количества)
            const multiplier = { 'A': 2.4, 'B': 1.8, 'C': 1.2 }[taskType] || 1.0;
            const size = cubeSize * multiplier;

            for (let i = 0; i < count; i++) {
                spawned++;
                const centerX = width / 2 + (Math.random() * 40 - 20);
                const startY = 65 + Math.random() * 35;

                setTimeout(() => {
                    World.add(world, Bodies.rectangle(centerX, startY, size, size, {
                        ...cubeStyle,
                        chamfer: { radius: Math.max(1, size / 15) },
                        render: {
                            fillStyle: cubeColor, // используем цвет в зависимости от типа
                            strokeStyle: cubeStyle.strokeStyle,
                            lineWidth: cubeStyle.lineWidth
                        },
                        // Добавляем метаданные о типе (опционально)
                        label: `cube_${taskType}`,
                        plugin: {
                            taskType: taskType
                        }
                    }));
                }, spawnDelay);

                spawnDelay += 144;
            }
        });

        console.log(`🎉 Создано кубов: ${spawned} (базовый размер ${cubeSize}px, с множителями по типам)`);
        console.log(`📊 Распределение по типам:`, typeStats);

    } catch (err) {
        console.error("❌ Ошибка:", err);
    }
});