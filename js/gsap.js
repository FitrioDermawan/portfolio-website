import { gsap } from "gsap";

gsap.to(".text, .logo", {
  y: 0,
  duration: 0.8,
  ease: "power4.out",
});

gsap.to(".triangle polygon", {
  attr: { fill: "#567445" },
  duration: 0.8,
  repeat: -1,
  ease:"power1.inOut",
  yoyo: true,
});