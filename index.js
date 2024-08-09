//three.js 홈페이지는 로딩창 만들어야 함(3D 로딩되는데 시간 걸리기 때문)
//노래도 깔아주는 편(콘텐츠성 무드)
//tip 아이콘도 네비 바에 추가
// import * as THREE from "../node_modules/three/build/three.module.js";
import * as THREE from "three";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { Scene_1 } from "./practice/scene-1move.js";
import { Scene_2 } from "./practice/scene-2move.js";
import { Scene_3 } from "./practice/scene-3move.js";
import { gsap } from "./node_modules/gsap/index.js";
//ㄴ가속도 설정은 greensock 사이트에 속도감 그래프 보고 정하면 됨

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({
    canvas, 
    antialias: true, 
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio * 2); // 해상도 설정 4k -> 1920 * 1080
renderer.shadowMap.enabled = true;
//부드러운 그림자
renderer.shadowMap.type = THREE.VSMShadowMap;

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight);
//camera zoom - 반응형
if(window.innerWidth < 600){
    camera.zoom = 0.6;
    camera.updateProjectionMatrix();
}
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.update();

const scene_1 = new Scene_1(renderer, camera, controls);
const scene_2 = new Scene_2(renderer, camera, controls);
const scene_3 = new Scene_3(renderer, camera, controls);
//콘솔창에서 각 씬 정보 볼 수 있음 - window로 선언해줄 시 다른 js에서도 활용 가능
window.scenes = [scene_1, scene_2, scene_3];

//arrow
const arrow_l = document.querySelector(".arrow_left");
const arrow_r = document.querySelector(".arrow_right");
//navigators
const btn_scene_1 = document.querySelector(".scene_1");
const btn_scene_2 = document.querySelector(".scene_2");
const btn_scene_3 = document.querySelector(".scene_3");
//con_right btn
const btn_tooltip = document.querySelector(".btn_tooltip");
const page_tooltip = document.querySelector(".tooltip");
const btn_sound = document.querySelector(".btn_sound");
//audio
const audio = document.querySelector("audio");
//title
const page_title = document.querySelector(".page_title");
//loading progress bar
const progress = document.querySelector(".progress");

let currentScene;
let sceneIndex = 1;
function sceneMove(number_){
    if(currentScene) currentScene.stop();

    scenes[number_ - 1].start();
    currentScene = scenes[number_ - 1];
    sceneIndex = number_;

    page_title.textContent = currentScene.title;
    page_tooltip.querySelector("p").textContent = currentScene.tooltip;

    // console.log(document.querySelectorAll(".item"));
    document.querySelectorAll(".item").forEach((el) => {
        el.classList.remove("active");
    });
    //화살표 키 못누르게 막힌 상태 속성 disabled
    document.querySelectorAll(".arrow").forEach((e)=>{
        e.classList.remove("disabled");
    });
    if(number_ == 1) {
        document.querySelector(".scene_1").classList.add("active");
        arrow_l.classList.add("disabled");
    }
    if(number_ == 2) document.querySelector(".scene_2").classList.add("active");
    if(number_ == 3) {
        document.querySelector(".scene_3").classList.add("active");
        arrow_r.classList.add("disabled");
    }

    gsap.to(document.body, {
        duration: 1,
        backgroundColor: currentScene.backgroundColor
    });
}
window.sceneMove = sceneMove;
//scenes 이동
function move(target, position = new THREE.Vector3(0, 0, 0)){
    controls.enabled = false;
    gsap.to(target, 
        {duration: 3, 
        ease: "power3",
        //가속도 설정은 greensock 사이트에 속도감 그래프 보고 정하면 됨
        x:position.x,
        y:position.y,
        z:position.z,
        onComplete(){
            controls.enabled = true;
        }
    });
}
window.move = move;
//로딩창
let loading_progress = 0;
function loading() {
	loading_progress += 1;
	progress.style.width = (loading_progress / 3) * 100 + "%";
	if (loading_progress == 3) {
		sceneMove(1);
		setTimeout(() => {
			document.querySelector(".dimmer").classList.add("end");
		}, 1100);
	}
}
window.loading = loading;
//arrow + menu bar click event
arrow_l.addEventListener("click", (e) => {
    let targetIndex = sceneIndex - 1;
    if(targetIndex < 1) targetIndex = 1;
    // ㄴ 0되는 것 방지하는 구문

    sceneMove(targetIndex);
});
arrow_r.addEventListener("click", (e) => {
    let targetIndex = sceneIndex + 1;
    if(targetIndex > 3) targetIndex = 3;

    sceneMove(targetIndex);
});

btn_scene_1.addEventListener("click", (e) => {
    sceneMove(1);
});
btn_scene_2.addEventListener("click", (e) => {
    sceneMove(2);
});
btn_scene_3.addEventListener("click", (e) => {
    sceneMove(3);
});
//팁창 토글로 제어하는 법(이거말고도 기존에 쓰던 법 등 있음)
btn_tooltip.addEventListener("click", (e) => {
    page_tooltip.classList.toggle("active");
});
//audio play
let audio_play = false;
btn_sound.addEventListener("click", (e) => {
    btn_sound.classList.toggle("active");
    //audio
    audio_play = !audio_play; //true
    if(audio_play) audio.muted = false;
    else audio.muted = true;
});