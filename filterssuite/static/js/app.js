//
// let stage = new Konva.Stage({
//     container: 'container',
//     width: 500,
//     height: 500,
// });
//
// let layer = new Konva.Layer();
//
// let yLine = new Konva.Line({
//     points: [500/2, 0, 500/2, 500],
//     stroke: 'black',
//     strokeWidth: 1,
//     lineCap: 'round',
//     lineJoin: 'round',
// });
//
// let xLine = new Konva.Line({
//     points: [0,500/2, 500, 500/2],
//     stroke: 'black',
//     strokeWidth: 1,
//     lineCap: 'round',
//     lineJoin: 'round',
// });
//
//
//
// let zeroDraw = false;
//
// layer.add(yLine);
// layer.add(xLine);
//
// layer.add(circle);
//
// // add the layer to the stage
// stage.add(layer);
//
//
// const mouseDownHandler = (event) => {
//
//     let objDraw = null;
//
//     // get the position of the mouse on click down
//     let x_current = stage.getPointerPosition().x,
//         y_current = stage.getPointerPosition().y;
//
//     if (zeroDraw) {
//         objDraw = new Konva.Circle({
//             x: x_current,
//             y: y_current,
//             radius: 6,
//             stroke: 'red',
//             strokeWidth: 3,
//             draggable: true,
//         });
//
//     } else {
//         objDraw = new Konva.Rect({
//             x: x_current,
//             y: y_current,
//             width: 12,
//             height: 12,
//             stroke: 'black',
//             strokeWidth: 3,
//             draggable: true,
//         });
//     }
//     layer.add(objDraw);
// }
//
// stage.on("mousedown", mouseDownHandler);