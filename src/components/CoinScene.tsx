import { useEffect, useRef } from "react";
import * as THREE from "three";

// Floating glowing 3D coins / chips background
export function CoinScene({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pink = new THREE.PointLight(0xff3da8, 4, 30);
    pink.position.set(-5, 3, 4);
    scene.add(pink);
    const gold = new THREE.PointLight(0xffd24a, 4, 30);
    gold.position.set(5, -2, 4);
    scene.add(gold);
    const cyan = new THREE.PointLight(0x4ad6ff, 3, 30);
    cyan.position.set(0, 4, -3);
    scene.add(cyan);

    // Coins
    const coins: THREE.Mesh[] = [];
    const coinGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.12, 48);
    const colors = [0xffd24a, 0xff3da8, 0x4ad6ff, 0xb37dff, 0x6cff9e];

    for (let i = 0; i < 14; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: colors[i % colors.length],
        metalness: 1,
        roughness: 0.15,
        clearcoat: 1,
        emissive: colors[i % colors.length],
        emissiveIntensity: 0.25,
      });
      const coin = new THREE.Mesh(coinGeo, mat);
      coin.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 1,
      );
      coin.rotation.x = Math.random() * Math.PI;
      coin.rotation.z = Math.random() * Math.PI;
      coin.userData = {
        spin: 0.005 + Math.random() * 0.02,
        wobble: Math.random() * Math.PI * 2,
        ySpeed: 0.002 + Math.random() * 0.004,
      };
      scene.add(coin);
      coins.push(coin);
    }

    let raf = 0;
    let t = 0;
    const animate = () => {
      t += 0.01;
      coins.forEach((c, i) => {
        c.rotation.y += c.userData.spin;
        c.rotation.x += c.userData.spin * 0.4;
        c.position.y += Math.sin(t + c.userData.wobble) * c.userData.ySpeed;
        c.position.x += Math.cos(t * 0.5 + i) * 0.001;
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      coinGeo.dispose();
      coins.forEach((c) => (c.material as THREE.Material).dispose());
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden />;
}
