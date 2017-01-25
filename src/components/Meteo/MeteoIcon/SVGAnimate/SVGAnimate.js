import { TweenMax } from 'gsap';
import $ from 'jquery';

export default function animateSun(identifier) {
  /* Rotation of Yellow pike */
  TweenMax.to($(identifier).find('.yellow_pike'), 180,
    { rotationZ: -360, transformOrigin: 'center center', ease: 'Linear.easeNone', repeat: -1 });
  /* Rotation of Orange pike */
  TweenMax.to($(identifier).find('.orange_pike'), 60,
    { rotationZ: 360, transformOrigin: 'center center', ease: 'Linear.easeNone', repeat: -1 });
}

export function animateMoon(identifier) {
  /* Growing moon */
  TweenMax.to($(identifier), 300, { scale: 1.2, repeat: -1, yoyo: true });
  /* Rotation moon */
  TweenMax.to($(identifier), 60, { rotationZ: -45, transformOrigin: 'center center', ease: 'Linear.easeNone', repeat: -1, yoyo: true });
}

export function animateCloud(identifier) {
  /* Follow bezier path */
  const path = [{ x: 0, y: 0 }, { x: 30, y: 0 },
                { x: 40, y: 30 }, { x: 10, y: 40 }];
  TweenMax.to($(identifier), 10, { bezier: { type: 'soft', values: path }, ease: 'Power5.easeInOut', repeat: -1, yoyo: true });
}

export function animateLittleCloud(identifier) {
  /* Follow bezier path */
  const path = [{ x: 0, y: 0 }, { x: 0, y: 20 },
                { x: 25, y: 15 }, { x: 5, y: 0 }];
  TweenMax.to($(identifier), 15, { bezier: { type: 'soft', values: path }, ease: 'Power5.easeInOut', repeat: -1, yoyo: true });
}
