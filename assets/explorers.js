const reduceExplorerMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function safeModule(setup) {
  try { setup(); } catch (error) { console.warn("Optional explorer unavailable", error); }
}

function fitExplorerCanvas(canvas) {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { width, height, ratio };
}

safeModule(() => {
  const explorer = document.querySelector("[data-day-explorer]");
  if (!explorer) return;
  const stories = {
    luke: [
      ["6:30 am", "Family arrives with the sunrise", "Grandchildren burst into the room before a vast family reunion and the Live Earth Festival."],
      ["Sunrise", "The coast opens into 2045", "Luke looks across the Pacific and North Stradbroke Island from the edge of the imagined Crystal City."],
      ["Morning", "A Starship crosses the sky", "Aura counts down to a sonic boom as a Starship arrives after a 35-minute Cape Canaveral to Brisbane journey."],
      ["Family time", "Hundreds of relationships become one family", "The Global Group Marriage brings more than 400 co-parents and hundreds of children into a coordinated family reunion."],
      ["1:00 pm", "The journey continues below ground", "Luke takes a shuttle to a 1,200 km/h hyperloop bound for the imagined Australian Antarctic City."]
    ],
    anantya: [
      ["Morning", "Anantya wakes on her own terms", "Her parents wake her after she disables or ignores the AGI alarm."],
      ["Getting ready", "She questions the settings", "Anantya asks why her parents chose spiritual personality settings for her Aura."],
      ["The commute", "Many routes remain open", "She considers ground transport, aerial transport, a school bus, scooter and train before choosing her path."],
      ["School", "Learning connects to planetary survival", "Space Nexus High School brings teachers, students, Aura systems, robots and drones into the same learning environment."],
      ["City of Light", "A civilisation shaped from thoughtforms", "The subterranean city contains temples and feels temple-like throughout, shaped by AI and robotics from elaborate thoughtforms and illuminated from the surface."]
    ]
  };
  let person = "luke";
  let moment = 0;
  const range = explorer.querySelector("[data-day-range]");
  const buttons = explorer.querySelectorAll("[data-day-person]");
  const time = explorer.querySelector("[data-day-time]");
  const title = explorer.querySelector("[data-day-title]");
  const copy = explorer.querySelector("[data-day-copy]");
  const update = () => {
    const scene = stories[person][moment];
    range.value = String(moment);
    time.textContent = scene[0];
    title.textContent = scene[1];
    copy.textContent = scene[2];
    buttons.forEach(button => button.classList.toggle("is-active", button.dataset.dayPerson === person));
  };
  buttons.forEach(button => button.addEventListener("click", () => { person = button.dataset.dayPerson; moment = 0; update(); }));
  range.addEventListener("input", () => { moment = Number(range.value); update(); });
  explorer.querySelector("[data-day-prev]").addEventListener("click", () => { moment = (moment + stories[person].length - 1) % stories[person].length; update(); });
  explorer.querySelector("[data-day-next]").addEventListener("click", () => { moment = (moment + 1) % stories[person].length; update(); });
  update();
});

safeModule(() => {
  const model = document.querySelector("[data-family-model]");
  if (!model) return;
  const adults = model.querySelector("[data-family-adults]");
  const children = model.querySelector("[data-family-children]");
  const care = model.querySelector("[data-family-care]");
  const homes = model.querySelector("[data-family-homes]");
  const adultRange = model.querySelector("[data-family-adults-range]");
  const childRange = model.querySelector("[data-family-children-range]");
  const homeRange = model.querySelector("[data-family-homes-range]");
  const canvas = model.querySelector("[data-family-canvas]");
  const context = canvas?.getContext("2d");
  const presets = {
    household: { adults: 5, children: 4, homes: 2, care: 12 },
    extended: { adults: 12, children: 18, homes: 6, care: 12 },
    network: { adults: 50, children: 80, homes: 20, care: 10 },
    "un-love": { adults: 386, children: 579, homes: 193, care: 8 },
    luke: { adults: 401, children: 610, homes: 96, care: 10 }
  };
  const readCount = (input, minimum) => {
    const cleaned = input.value.trim().replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, "");
    if (!cleaned) return BigInt(minimum);
    const count = BigInt(cleaned);
    return count < BigInt(minimum) ? BigInt(minimum) : count;
  };
  const formatCount = value => value.toLocaleString("en-AU");
  const boundedNumber = (value, maximum) => Number(value > BigInt(maximum) ? BigInt(maximum) : value);
  let pendingDraw = 0;
  const draw = (adultCount, childCount, homeCount) => {
    if (!context || !canvas) return;
    const { width, height } = fitExplorerCanvas(canvas);
    context.clearRect(0, 0, width, height);
    const field = context.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.64);
    field.addColorStop(0, "rgba(101,168,255,0.18)");
    field.addColorStop(0.48, "rgba(167,123,255,0.08)");
    field.addColorStop(1, "rgba(3,5,13,0)");
    context.fillStyle = field;
    context.fillRect(0, 0, width, height);
    const visualHomes = Math.max(1, Math.min(24, boundedNumber(homeCount, 24)));
    const homeRadius = Math.min(width, height) * 0.34;
    const homePoints = [];
    for (let index = 0; index < visualHomes; index += 1) {
      const angle = (index / visualHomes) * Math.PI * 2 - Math.PI / 2;
      const x = width * 0.5 + Math.cos(angle) * homeRadius;
      const y = height * 0.5 + Math.sin(angle) * homeRadius * 0.58;
      homePoints.push([x, y]);
      context.beginPath();
      context.fillStyle = "rgba(255,200,91,0.7)";
      context.arc(x, y, Math.max(2.4, width / 300), 0, Math.PI * 2);
      context.fill();
    }
    context.strokeStyle = "rgba(99,242,223,0.13)";
    context.lineWidth = Math.max(1, width / 1000);
    homePoints.forEach(([x, y], index) => {
      const [nextX, nextY] = homePoints[(index + 1) % homePoints.length];
      context.beginPath();
      context.moveTo(x, y);
      context.quadraticCurveTo(width * 0.5, height * 0.5, nextX, nextY);
      context.stroke();
    });
    const paintPeople = (count, maximum, colour, startRadius, endRadius, dotSize) => {
      const visible = Math.max(1, Math.min(maximum, boundedNumber(count, maximum)));
      for (let index = 0; index < visible; index += 1) {
        const angle = index * 2.399963 + (colour === "#ff637d" ? 0.7 : 0);
        const progress = Math.sqrt((index + 0.5) / visible);
        const radius = startRadius + (endRadius - startRadius) * progress;
        const x = width * 0.5 + Math.cos(angle) * radius;
        const y = height * 0.5 + Math.sin(angle) * radius * 0.58;
        context.beginPath();
        context.fillStyle = colour;
        context.globalAlpha = 0.42 + (index % 5) * 0.1;
        context.arc(x, y, dotSize, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    };
    paintPeople(adultCount, 150, "#63f2df", Math.min(width, height) * 0.04, Math.min(width, height) * 0.25, Math.max(1.6, width / 520));
    if (childCount > 0n) paintPeople(childCount, 110, "#ff637d", Math.min(width, height) * 0.08, Math.min(width, height) * 0.3, Math.max(1.35, width / 620));
    context.beginPath();
    context.fillStyle = "rgba(255,255,255,0.92)";
    context.arc(width * 0.5, height * 0.5, Math.max(3, width / 260), 0, Math.PI * 2);
    context.fill();
  };
  const scheduleDraw = (adultCount, childCount, homeCount) => {
    cancelAnimationFrame(pendingDraw);
    pendingDraw = requestAnimationFrame(() => draw(adultCount, childCount, homeCount));
  };
  const update = () => {
    const adultCount = readCount(adults, 3);
    const childCount = readCount(children, 0);
    const careHours = Math.max(0, Math.round(Number(care.value) || 0));
    const homeCount = readCount(homes, 1);
    const bonds = adultCount * (adultCount - 1n) / 2n;
    const sharedHours = adultCount * BigInt(careHours);
    const circles = (adultCount + 11n) / 12n;
    const perChild = childCount ? sharedHours / childCount : sharedHours;
    model.querySelector("[data-adults-output]").value = formatCount(adultCount);
    model.querySelector("[data-children-output]").value = formatCount(childCount);
    model.querySelector("[data-care-output]").value = careHours;
    model.querySelector("[data-homes-output]").value = formatCount(homeCount);
    model.querySelector("[data-bonds-output]").textContent = formatCount(bonds);
    model.querySelector("[data-hours-output]").textContent = formatCount(sharedHours);
    model.querySelector("[data-circles-output]").textContent = formatCount(circles);
    model.querySelector("[data-resilience-output]").textContent = formatCount(adultCount - 1n);
    model.querySelector("[data-family-scale-label]").textContent = `${formatCount(adultCount)} adults, ${formatCount(childCount)} children, ${formatCount(homeCount)} homes`;
    model.querySelector("[data-model-note]").textContent = childCount
      ? `Across ${formatCount(homeCount)} connected ${homeCount === 1n ? "home" : "homes"}, this scenario has at least ${formatCount(perChild)} whole shared-care hours per child each week before paid services or wider community support.`
      : `Across ${formatCount(homeCount)} connected ${homeCount === 1n ? "home" : "homes"}, ${formatCount(sharedHours)} shared-care hours can move into elder care, community care, domestic work, rest or other priorities chosen by the family.`;
    adultRange.value = String(Math.min(Number(adultRange.max), boundedNumber(adultCount, Number(adultRange.max))));
    childRange.value = String(Math.min(Number(childRange.max), boundedNumber(childCount, Number(childRange.max))));
    homeRange.value = String(Math.min(Number(homeRange.max), boundedNumber(homeCount, Number(homeRange.max))));
    scheduleDraw(adultCount, childCount, homeCount);
  };
  const clearPreset = () => model.querySelectorAll("[data-family-preset]").forEach(item => item.classList.remove("is-active"));
  const bindRange = (range, input) => range.addEventListener("input", () => { input.value = range.value; clearPreset(); update(); });
  bindRange(adultRange, adults);
  bindRange(childRange, children);
  bindRange(homeRange, homes);
  [adults, children, care, homes].forEach(input => input.addEventListener("input", () => { clearPreset(); update(); }));
  model.querySelectorAll("[data-family-preset]").forEach(button => button.addEventListener("click", () => {
    const preset = presets[button.dataset.familyPreset];
    adults.value = String(preset.adults);
    children.value = String(preset.children);
    homes.value = String(preset.homes);
    care.value = String(preset.care);
    model.querySelectorAll("[data-family-preset]").forEach(item => item.classList.toggle("is-active", item === button));
    update();
  }));
  window.addEventListener("resize", update, { passive: true });
  update();
});

safeModule(() => {
  const explorer = document.querySelector("[data-scale-explorer]");
  if (!explorer) return;
  const scales = {
    home: ["1 home", "Practical direction", "Daily abundance begins with shared capacity", "Larger families and connected homes can share care, food, tools, income, learning and rest without erasing personal sovereignty."],
    community: ["1 neighbourhood", "Active project direction", "Resilience becomes a shared local practice", "Energy, water, food, shelter, knowledge, transport, culture and mutual aid become stronger when they are designed as connected capabilities."],
    planet: ["1 living Earth", "Vision and active research", "Planetary responsibility becomes daily infrastructure", "GAJRA Earth and Grain by Grain connect local choices with global resilience, open participation and joyful responsible abundance."],
    cosmos: ["1 civilisation", "Speculative horizon", "The future opens beyond Earth", "The 2045 scenario reaches the Moon, Mars, orbital infrastructure, generation ships and DNA Ark Seed Ships while keeping human relationships at its emotional centre."]
  };
  const buttons = explorer.querySelectorAll("[data-scale]");
  const update = key => {
    const item = scales[key];
    explorer.querySelector("[data-scale-size]").textContent = item[0];
    explorer.querySelector("[data-scale-status]").textContent = item[1];
    explorer.querySelector("[data-scale-title]").textContent = item[2];
    explorer.querySelector("[data-scale-copy]").textContent = item[3];
    buttons.forEach(button => button.classList.toggle("is-active", button.dataset.scale === key));
  };
  buttons.forEach(button => button.addEventListener("click", () => update(button.dataset.scale)));
  update("home");
});

safeModule(() => {
  const shell = document.querySelector("[data-torus-shell]");
  if (!shell) return;
  const canvas = shell.querySelector("[data-torus-canvas]");
  const context = canvas.getContext("2d");
  if (!context) return;
  const densityInput = shell.querySelector("[data-torus-density]");
  const depthInput = shell.querySelector("[data-torus-depth]");
  const densityOutput = shell.querySelector("[data-torus-density-output]");
  const depthOutput = shell.querySelector("[data-torus-depth-output]");
  let pointerX = 0;
  let pointerY = 0;
  shell.addEventListener("pointermove", event => {
    const rect = shell.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.7;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.45;
  });
  const draw = time => {
    const { width, height } = fitExplorerCanvas(canvas);
    context.clearRect(0, 0, width, height);
    const density = Number(densityInput.value);
    const relationshipDepth = Number(depthInput.value);
    densityOutput.value = density;
    depthOutput.value = relationshipDepth;
    const points = [];
    const spin = reduceExplorerMotion ? 0.45 : time * 0.00015;
    for (let index = 0; index < density; index += 1) {
      const u = ((index * 0.61803398875) % 1) * Math.PI * 2;
      const v = ((index * 0.41421356237) % 1) * Math.PI * 2;
      const major = 1.15;
      const minor = 1.15;
      let x = (major + minor * Math.cos(v)) * Math.cos(u);
      let y = (major + minor * Math.cos(v)) * Math.sin(u);
      let z = minor * Math.sin(v);
      const angleY = spin + pointerX;
      const x1 = x * Math.cos(angleY) - z * Math.sin(angleY);
      const z1 = x * Math.sin(angleY) + z * Math.cos(angleY);
      const angleX = -0.58 + pointerY;
      const y1 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
      const z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);
      const perspective = 3.8 / (4.5 - z2);
      points.push({ x: width * 0.5 + x1 * width * 0.16 * perspective, y: height * 0.46 + y1 * height * 0.23 * perspective, z: z2, u, v, perspective });
    }
    points.sort((a, b) => a.z - b.z);
    context.globalCompositeOperation = "lighter";
    points.forEach((point, index) => {
      const hue = 178 + ((point.u + point.v) / (Math.PI * 4)) * 105;
      const alpha = 0.24 + point.perspective * 0.28;
      const radius = Math.max(1.1, width / 900) * (0.8 + point.perspective);
      context.fillStyle = `hsla(${hue},90%,68%,${alpha})`;
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, Math.PI * 2);
      context.fill();
      if (index % Math.max(3, 12 - relationshipDepth) === 0) {
        const next = points[(index + relationshipDepth * 3) % points.length];
        context.strokeStyle = `hsla(${hue},90%,68%,${0.025 + relationshipDepth * 0.006})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(next.x, next.y);
        context.stroke();
      }
    });
    context.globalCompositeOperation = "source-over";
    if (!reduceExplorerMotion) requestAnimationFrame(draw);
  };
  [densityInput, depthInput].forEach(input => input.addEventListener("input", () => { if (reduceExplorerMotion) draw(0); }));
  requestAnimationFrame(draw);
});

safeModule(() => {
  const explorer = document.querySelector("[data-precedent-explorer]");
  if (!explorer) return;
  const canvas = explorer.querySelector("[data-precedent-canvas]");
  const context = canvas.getContext("2d");
  if (!context) return;
  const precedents = {
    helsinki: {
      place: "Finland", title: "Helsinki plans underground at city scale",
      copy: "Helsinki records more than 400 underground facilities, about 10 million cubic metres of built underground space and 220 kilometres of technical tunnels. Rock shelters serve daily life as sport, parking and cultural spaces, then support civil defence when needed.",
      source: "https://www.hel.fi/static/kv/BuildingHelsinki.pdf", x: 0.53, y: 0.22
    },
    singapore: {
      place: "Singapore", title: "Infrastructure forms a coordinated underground layer",
      copy: "Singapore plans rail, roads, water, sewage, electricity, pedestrian links and storage as one underground urban layer. Jurong Rock Caverns operate 150 metres below ground with 1.47 million cubic metres of storage.",
      source: "https://www.ura.gov.sg/land-planning/master-plan/master-plan-2025/themes/strengthening-urban-resilience/an-underground-of-possibilities/", x: 0.73, y: 0.61
    },
    japan: {
      place: "Japan", title: "A vast underground channel buffers floods",
      copy: "Japan's Metropolitan Area Outer Underground Discharge Channel runs 6.3 kilometres about 50 metres below ground, stores 670,000 cubic metres and can discharge 200 cubic metres per second.",
      source: "https://www.ktr.mlit.go.jp/edogawa/edogawa00576.html", x: 0.83, y: 0.39
    },
    seoul: {
      place: "South Korea", title: "Food grows inside operating metro stations",
      copy: "Seoul's public data records controlled-environment smart farms in subway stations, including 523 square metres at Sangdo and 101 square metres at Cheonwang. It is a real food-system component at neighbourhood scale.",
      source: "https://data.seoul.go.kr/dataList/OA-22491/F/1/datasetView.do", x: 0.79, y: 0.36
    },
    montreal: {
      place: "Canada", title: "Underground movement is ordinary daily life",
      copy: "Montreal's RESO links transit, education, culture, work and around 4,000 shops and services through 32 kilometres of galleries used by nearly 500,000 people each day.",
      source: "https://montreal.ca/articles/reso-le-reseau-souterrain-de-montreal-13713", x: 0.22, y: 0.34
    },
    coober: {
      place: "Australia", title: "Rock-cut homes soften desert extremes",
      copy: "Coober Pedy's homes, churches, hotels and shops use the ground's thermal stability to make daily life more comfortable through desert temperature extremes.",
      source: "https://southaustralia.com/destinations/flinders-ranges-and-outback/places/coober-pedy", x: 0.82, y: 0.77
    },
    svalbard: {
      place: "Norway", title: "A mountain protects crop memory",
      copy: "The Svalbard Global Seed Vault holds more than 1.38 million seed samples from 132 depositors, more than 100 metres inside a mountain as a backup for future generations.",
      source: "https://www.seedvault.no/", x: 0.49, y: 0.11
    },
    snolab: {
      place: "Canada", title: "Deep Earth creates a rare scientific environment",
      copy: "SNOLAB operates two kilometres underground with 5,000 square metres of clean laboratory space. Its rock shielding reduces cosmic radiation by a factor of about 50 million.",
      source: "https://www.snolab.ca/facility/about-the-facilities/", x: 0.2, y: 0.29
    }
  };
  let selected = "helsinki";
  let pendingDraw = 0;
  const draw = () => {
    const { width, height } = fitExplorerCanvas(canvas);
    context.clearRect(0, 0, width, height);
    const glow = context.createRadialGradient(width * 0.5, height * 0.48, 0, width * 0.5, height * 0.48, width * 0.47);
    glow.addColorStop(0, "rgba(31,58,108,0.8)");
    glow.addColorStop(0.58, "rgba(8,19,42,0.82)");
    glow.addColorStop(1, "rgba(3,5,13,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.strokeStyle = "rgba(101,168,255,0.2)";
    context.lineWidth = Math.max(1, width / 1000);
    context.beginPath();
    context.ellipse(0, 0, width * 0.4, height * 0.38, 0, 0, Math.PI * 2);
    context.stroke();
    [-0.55, 0, 0.55].forEach(offset => {
      context.beginPath();
      context.ellipse(0, offset * height * 0.38, width * 0.4 * Math.cos(offset), height * 0.1, 0, 0, Math.PI * 2);
      context.stroke();
    });
    [-0.62, 0, 0.62].forEach(offset => {
      context.beginPath();
      context.ellipse(0, 0, width * 0.13, height * 0.38, offset, 0, Math.PI * 2);
      context.stroke();
    });
    context.restore();
    Object.entries(precedents).forEach(([key, item]) => {
      const x = item.x * width;
      const y = item.y * height;
      const active = key === selected;
      const pulse = context.createRadialGradient(x, y, 0, x, y, active ? 24 : 14);
      pulse.addColorStop(0, active ? "rgba(255,200,91,0.95)" : "rgba(99,242,223,0.8)");
      pulse.addColorStop(1, "rgba(99,242,223,0)");
      context.fillStyle = pulse;
      context.beginPath();
      context.arc(x, y, active ? 24 : 14, 0, Math.PI * 2);
      context.fill();
    });
  };
  const scheduleDraw = () => {
    cancelAnimationFrame(pendingDraw);
    pendingDraw = requestAnimationFrame(draw);
  };
  const select = key => {
    selected = key;
    const item = precedents[key];
    explorer.querySelector("[data-precedent-place]").textContent = item.place;
    explorer.querySelector("[data-precedent-title]").textContent = item.title;
    explorer.querySelector("[data-precedent-copy]").textContent = item.copy;
    explorer.querySelector("[data-precedent-source]").href = item.source;
    explorer.querySelectorAll("[data-precedent]").forEach(button => button.classList.toggle("is-active", button.dataset.precedent === key));
    scheduleDraw();
  };
  explorer.querySelectorAll("[data-precedent]").forEach(button => button.addEventListener("click", () => select(button.dataset.precedent)));
  window.addEventListener("resize", scheduleDraw, { passive: true });
  select(selected);
});

safeModule(() => {
  const model = document.querySelector("[data-subterranean-model]");
  if (!model) return;
  const canvas = model.querySelector("[data-subterranean-canvas]");
  const context = canvas.getContext("2d");
  if (!context) return;
  const depthInput = model.querySelector("[data-city-depth]");
  const populationInput = model.querySelector("[data-city-population]");
  const lightInput = model.querySelector("[data-city-light]");
  const loopsInput = model.querySelector("[data-city-loops]");
  let cityVisible = false;
  let cityFrame = 0;
  const formatPopulation = value => value >= 1000000 ? `${(value / 1000000).toFixed(value % 1000000 ? 1 : 0)} million` : value.toLocaleString("en-AU");
  const updateOutputs = () => {
    const depth = Number(depthInput.value);
    const population = Number(populationInput.value);
    const portals = Number(lightInput.value);
    const loops = Number(loopsInput.value);
    const levels = Math.max(2, Math.round(depth / 35));
    model.querySelector("[data-depth-output]").value = `${depth.toLocaleString("en-AU")} m`;
    model.querySelector("[data-population-output]").value = formatPopulation(population);
    model.querySelector("[data-light-output]").value = portals;
    model.querySelector("[data-loops-output]").value = loops;
    model.querySelector("[data-levels-output]").textContent = levels.toLocaleString("en-AU");
    model.querySelector("[data-portals-output]").textContent = (portals / (population / 1000000)).toFixed(1);
    model.querySelector("[data-loop-output]").textContent = loops.toLocaleString("en-AU");
  };
  const draw = time => {
    cityFrame = 0;
    const { width, height } = fitExplorerCanvas(canvas);
    const depth = Number(depthInput.value);
    const population = Number(populationInput.value);
    const portals = Number(lightInput.value);
    const loops = Number(loopsInput.value);
    context.clearRect(0, 0, width, height);
    const sky = context.createLinearGradient(0, 0, 0, height * 0.22);
    sky.addColorStop(0, "#071329");
    sky.addColorStop(1, "#182848");
    context.fillStyle = sky;
    context.fillRect(0, 0, width, height * 0.18);
    const earth = context.createLinearGradient(0, height * 0.16, 0, height);
    earth.addColorStop(0, "#201a27");
    earth.addColorStop(0.25, "#100f1d");
    earth.addColorStop(1, "#050711");
    context.fillStyle = earth;
    context.fillRect(0, height * 0.16, width, height * 0.84);
    context.strokeStyle = "rgba(99,242,223,0.45)";
    context.lineWidth = Math.max(2, width / 700);
    context.beginPath();
    context.moveTo(0, height * 0.17);
    context.bezierCurveTo(width * 0.25, height * 0.13, width * 0.7, height * 0.21, width, height * 0.16);
    context.stroke();
    const visualPortals = Math.min(18, Math.max(3, Math.round(portals / 8)));
    for (let index = 0; index < visualPortals; index += 1) {
      const x = width * (0.08 + index / Math.max(1, visualPortals - 1) * 0.84);
      const reach = height * (0.28 + (index % 4) * 0.07 + depth / 1500 * 0.18);
      const beam = context.createLinearGradient(0, height * 0.13, 0, reach);
      beam.addColorStop(0, "rgba(255,220,135,0.58)");
      beam.addColorStop(1, "rgba(255,200,91,0)");
      context.fillStyle = beam;
      context.beginPath();
      context.moveTo(x - width * 0.006, height * 0.14);
      context.lineTo(x + width * 0.006, height * 0.14);
      context.lineTo(x + width * 0.035, reach);
      context.lineTo(x - width * 0.035, reach);
      context.closePath();
      context.fill();
    }
    const levels = Math.min(24, Math.max(3, Math.round(depth / 55)));
    const rings = Math.min(9, Math.max(2, Math.round(Math.log10(population / 100000 + 1) * 4)));
    for (let level = 0; level < levels; level += 1) {
      const y = height * (0.27 + level / Math.max(1, levels - 1) * 0.62);
      const spread = 0.84 - level / levels * 0.18;
      context.strokeStyle = `rgba(${level % 3 === 0 ? "99,242,223" : "101,168,255"},${0.12 + loops * 0.015})`;
      context.lineWidth = Math.max(1, width / 1100);
      context.beginPath();
      context.ellipse(width * 0.5, y, width * spread * 0.5, height * 0.026, 0, 0, Math.PI * 2);
      context.stroke();
      const hubs = Math.max(4, rings + (level % 3));
      for (let hub = 0; hub < hubs; hub += 1) {
        const x = width * 0.5 + Math.cos((hub / hubs) * Math.PI * 2 + level * 0.45) * width * spread * 0.43;
        const pulse = reduceExplorerMotion ? 1 : 0.7 + Math.sin(time * 0.002 + hub + level) * 0.3;
        context.fillStyle = level % 2 ? `rgba(255,200,91,${0.42 + pulse * 0.18})` : `rgba(99,242,223,${0.38 + pulse * 0.16})`;
        context.beginPath();
        context.arc(x, y, Math.max(1.5, width / 700) * (0.7 + pulse), 0, Math.PI * 2);
        context.fill();
      }
    }
    if (!reduceExplorerMotion && cityVisible && !document.hidden) cityFrame = requestAnimationFrame(draw);
  };
  const requestDraw = () => {
    if (!cityFrame) cityFrame = requestAnimationFrame(draw);
  };
  [depthInput, populationInput, lightInput, loopsInput].forEach(input => input.addEventListener("input", () => { updateOutputs(); requestDraw(); }));
  if ("IntersectionObserver" in window) {
    const cityObserver = new IntersectionObserver(entries => {
      cityVisible = entries[0]?.isIntersecting === true;
      if (cityVisible) requestDraw();
    }, { rootMargin: "120px" });
    cityObserver.observe(model);
  } else {
    cityVisible = true;
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden && cityVisible) requestDraw(); });
  updateOutputs();
  requestDraw();
});

safeModule(() => {
  const explorer = document.querySelector("[data-timeline-explorer]");
  if (!explorer) return;
  const timeline = {
    2022: ["The public project era begins", "500 Queens Venture Capital launches in Brisbane with a $40 million fund and a first cohort of 100 female-led startups. Aura of Intelligence and GAJRA.Earth also launch in the scenario.", "Women-led companies receive 2.3% of venture-capital funding."],
    2023: ["Work and fusion experiments accelerate", "Australia and New Zealand begin the Try Everything Once workforce trial, a second women-led cohort forms and micro plasma fusion is described as developed and safe.", "No separate numerical data point was recorded for this year."],
    2024: ["Women-led enterprise scales", "10,000 Queens Venture Capital launches with a $1 billion fund, 20 startup cohorts and a Tesla Optimus demonstration.", "The Luke narrative dates stable micro fusion to this year, while the workbook dates it to 2023."],
    2025: ["A worldwide gathering", "A worldwide Live Aid, African Union adoption of workforce and democracy experiments, and Optimus production appear in the scenario.", "No separate numerical data point was recorded for this year."],
    2026: ["The Antarctic route begins", "Construction begins on a Cairns to Antarctica hyperloop and Optimus travels to Mars.", "No separate numerical data point was recorded for this year."],
    2027: ["Routes widen", "An Adelaide to India and Europe hyperloop begins via Perth, while the rotating Moon population reaches 100 humans and 400 Optimus units.", "Moon scenario population: 100 humans and 400 Optimus units."],
    2028: ["Crystal City and Mars", "Crystal City construction begins on Quandamooka Country in the scenario and the first human Mars fleet lands.", "This is authored scenario material and does not evidence cultural approval or project delivery."],
    2029: ["Infrastructure scales worldwide", "50,000 Queens Venture Capital launches, worldwide hyperloop construction begins and the Moon population exceeds 1,000.", "Moon scenario population: more than 1,000."],
    2030: ["Workforce change goes worldwide", "The Try Everything Once workforce model is adopted worldwide and Crystal City's Star-Port artificial island is completed in the scenario.", "No separate numerical data point was recorded for this year."],
    2031: ["Aura AGI enters the public timeline", "Australia's east and south hyperloop corridor completes and Aura with GAJRA.Earth publicly launches a peer-reviewed Aura AGI in the scenario.", "Women-led companies receive 60% of venture-capital funding in the scenario data."],
    2032: ["Brisbane celebrates", "The Brisbane Olympics take place as Luke turns 50 and Aura and GAJRA Earth turn 10.", "Women-led companies receive 55% of venture-capital funding in the scenario data."],
    2033: ["Regional alliance and orbital debate", "A South East Asian alliance forms around a South China Sea subterranean megacity and the UN narrowly rejects an Aura AGI Lunar Orbital Ring proposal.", "Women-led companies receive 50% of venture-capital funding in the scenario data."],
    2034: ["Antarctica enters the plan", "Hyperloop sections to Antarctica, India and Europe complete, while the UN supports an Australian-led Antarctic subterranean mining and settlement proposal in the scenario.", "Scenario data: life expectancy 90 and trilingualism 20%."],
    2035: ["The first global vote", "Live World marks Live Aid's 50th anniversary and Aura AGI supports a first global vote on Whole System Change.", "Scenario data: English first-, second- or third-language participation begins at 20%."],
    2036: ["Extreme disruption changes the horizon", "An X50 solar flare and extreme climate disruption are followed by a recurrent micro-nova model and Kardashev II goals in the story world.", "The micro-nova material is an extraordinary story-world hypothesis, not established science here."],
    2037: ["A ten-year research program begins", "Kardashev research starts, a revised Lunar Orbital Ring gains UN approval and Space Nexus High School opens in Anantya's world.", "No separate numerical data point was recorded for this year."],
    2038: ["Mars and Crystal City grow", "Mars reaches 100,000 people and Crystal City reaches two million in the scenario.", "Scenario populations: Mars 100,000 and Crystal City two million."],
    2039: ["Responsible abundance replaces poverty", "Third-generation subterranean cities begin mass construction and the UN declares poverty replaced by responsible abundance in the scenario.", "Scenario data: life expectancy 100 and trilingualism 40%."],
    2040: ["The New Age begins", "The timeline names the first day of the New Age, alongside Mercury mining and a ten-year plan for 200 off-world subterranean cities.", "Off-world city scenario target: 200."],
    2041: ["Orbital infrastructure takes shape", "The first Lunar Orbital Ring stage completes and Earth exceeds nine billion people in the scenario.", "Scenario Earth population: more than nine billion."],
    2042: ["Subterranean scale and Mercury", "The South China Sea city becomes Earth's densest and most populated, while Mercury mining scales toward a Dyson swarm.", "No separate numerical data point was recorded for this year."],
    2043: ["The DNA Ark proposal", "An interstellar Human DNA Ark Seed Ship proposal is accepted and enabling technologies are approved in the scenario.", "The workbook's Aura AGI year-count does not reconcile cleanly with its 2031 public launch date."],
    2044: ["Ships leave for nearby stars", "The first generation ship begins construction and 100 Aura AGI DNA Ark ships launch toward nearby stars.", "Scenario data: life expectancy 110 and trilingualism 70%."],
    2045: ["Live Earth", "Live Earth celebrates readiness for a predicted 2048 event, while Mars reaches one million people and full self-sustainability in the scenario.", "Scenario data: English first-, second- or third-language participation reaches 80%." ]
  };
  const range = explorer.querySelector("[data-year-range]");
  const update = () => {
    const year = Number(range.value);
    const item = timeline[year];
    explorer.querySelector("[data-year-output]").textContent = year;
    explorer.querySelector("[data-year-title]").textContent = item[0];
    explorer.querySelector("[data-year-event]").textContent = item[1];
    explorer.querySelector("[data-year-data]").textContent = `Scenario note: ${item[2]}`;
  };
  range.addEventListener("input", update);
  explorer.querySelector("[data-year-prev]").addEventListener("click", () => { range.value = String(Math.max(2022, Number(range.value) - 1)); update(); });
  explorer.querySelector("[data-year-next]").addEventListener("click", () => { range.value = String(Math.min(2045, Number(range.value) + 1)); update(); });
  update();
});

safeModule(() => {
  const filter = document.querySelector("[data-project-filter]");
  if (!filter) return;
  const buttons = filter.querySelectorAll("[data-project-filter-button]");
  const cards = filter.querySelectorAll("[data-project-category]");
  buttons.forEach(button => button.addEventListener("click", () => {
    const category = button.dataset.projectFilterButton;
    buttons.forEach(item => item.classList.toggle("is-active", item === button));
    cards.forEach(card => {
      const categories = card.dataset.projectCategory.split(" ");
      card.hidden = category !== "all" && !categories.includes(category);
    });
  }));
});
