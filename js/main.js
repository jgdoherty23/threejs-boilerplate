console.log("debug: main");

var stats;
var showStatsPanel = true;

var clock;
var deltaTime;

var container;
var renderer, scene, camera;
var sphere;
var ambientLight, pointLight;

var deviceOrientationControls;
var lastAlpha;

init();
animate();

function init()
{
	console.log("debug: init");

	stats = new Stats();
	if (showStatsPanel)
	{
		stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
		document.body.appendChild(stats.dom);
	}

	// clock
	clock = new THREE.Clock();

	// container
	container = document.createElement('div');
	document.body.appendChild(container);

	// renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	// scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color('white');

	// camera
	var fov = 50;
	var aspect = window.innerWidth/window.innerHeight;
	var near = 1;
	var far = 100000;
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.z = -5;
	camera.lookAt(scene.position);

	// sphere
	var sphereRadius = 1;
	var sphereWidthSegments = 64;
	var sphereHeightSegments = 64;
	var sphereGeometry = new THREE.SphereGeometry(
		sphereRadius,
		sphereWidthSegments,
		sphereHeightSegments
	);
	var sphereMaterial = new THREE.MeshStandardMaterial();
	sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	scene.add(sphere);

	// ambient light
	ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambientLight);

	// point light
	pointLight = new THREE.PointLight(0xffffff, 0.5);
	scene.add(pointLight);
	pointLight.position.set(10, 15, -10);
	scene.add(pointLight);

	if (window.orientation != null)
	{
		deviceOrientationControls = new THREE.DeviceOrientationControls(camera);
		deviceOrientationControls.enabled = false;
	} 

	// listeners
	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize()
{
  resetRenderer();
}

function resetRenderer()
{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() 
{
	renderer.render(scene, camera);
}

function animate() 
{
	requestAnimationFrame(animate);

	stats.begin();
	
	deltaTime = clock.getDelta();

	// handle ios orientation issues
	if (window.orientation != null)
	{
		deviceOrientationControls.update();
		if (lastAlpha != deviceOrientationControls.deviceOrientation.alpha)
		{
			resetRenderer();
			lastAlpha = deviceOrientationControls.deviceOrientation.alpha;
		}
	}

	stats.end();

	render();
}