// tslint:disable no-bitwise
import closest from "closest";
// import { PointModel } from "./models/PointModel";
import { ROUTING_SCALING_FACTOR } from "./routing/PathFinding";
import Path from "paths-js/path";

export class Toolkit {
  TESTING = false;
  TESTING_UID = 0;
	/**
	 * Generats a unique ID (thanks Stack overflow :3)
	 * @returns {String}
	 */
 	UID(){
		if (Toolkit[this.testing]) {
			Toolkit[this.testing_uid]++;
			return "" + Toolkit[this.testing_uid];
		}
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
			const r = (Math.random() * 16) | 0;
			const v = c === "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	/**
	 * Finds the closest element as a polyfill
	 *
	 * @param  {Element} element  [description]
	 * @param  {string}  selector [description]
	 */
	closest(element, selector) {
		if (document.body.closest) {
			return element.closest(selector);
		}
		return closest(element, selector);
	}

	generateLinePath(firstPoint, lastPoint){
		return `M${firstPoint.x},${firstPoint.y} L ${lastPoint.x},${lastPoint.y}`;
	}

	generateCurvePath(firstPoint, lastPoint, curvy = 0){
		// var isHorizontal = true
		var curvyX = 200;
		var curvyY = 0;
		if (firstPoint.parent.sourcePort && firstPoint.parent.sourcePort.in){
			let temp = firstPoint;
			firstPoint = lastPoint;
			lastPoint = temp;
		}
		if (Math.abs(lastPoint.y - firstPoint.y) < 10){
			curvyX = 0
			curvyY = 0;
		}

		return `M${firstPoint.x},${firstPoint.y} C ${firstPoint.x + curvyX},${firstPoint.y + curvyY}
    ${lastPoint.x - curvyX},${lastPoint.y - curvyY} ${firstPoint.parent.sourcePort && firstPoint.parent.targetPort ? lastPoint.x-15 : lastPoint.x+5},${lastPoint.y}`;
	}

	generateDynamicPath(pathCoords) {
		let path = Path();
		path = path.moveto(pathCoords[0][0] * ROUTING_SCALING_FACTOR, pathCoords[0][1] * ROUTING_SCALING_FACTOR);
		pathCoords.slice(1).forEach(coords => {
			path = path.lineto(coords[0] * ROUTING_SCALING_FACTOR, coords[1] * ROUTING_SCALING_FACTOR);
		});
		return path.print();
	}
}
