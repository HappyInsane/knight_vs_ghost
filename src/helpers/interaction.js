//Entity Interaction

/*
obj : {height:y, width:x, position:[x,y]}

Notación:

XK1 X de objeto K izquierda
XK2 X de objeto K derecha

YK1 Y de objeto K inferior
YK2 Y de objeto K superior
*/

export function overlap(objA, objB) {
  const XA1 = objA.position[0] - objA.width / 2;
  const XA2 = objA.position[0] + objA.width / 2;
  const YA1 = objA.position[1] - objA.height / 2;
  const YA2 = objA.position[1] + objA.height / 2;

  const XB1 = objB.position[0] - objB.width / 2;
  const XB2 = objB.position[0] + objB.width / 2;
  const YB1 = objB.position[1] - objB.height / 2;
  const YB2 = objB.position[1] + objB.height / 2;

  //verifica si los objetos estan uno encima del otro
  if (
    ((YA2 > YB1 && YA1 < YB2) || (YB2 > YA1 && YB1 < YA2)) &&
    ((XA1 < XB2 && XA2 > XB1) || (XB1 < XA2 && XB2 > XA1))
  ) {
    return true;
  }
  return false;
}

export function contain(gridDimension, obj) {
  let topV = obj.position[1] - obj.height / 2;
  let bottomV = obj.position[1] + obj.height / 2;
  let leftV = obj.position[0] - obj.width / 2;
  let rightV = obj.position[0] + obj.width / 2;

  if (
    topV > 0 &&
    leftV > 0 &&
    bottomV < gridDimension.height - 6 &&
    rightV < gridDimension.width - 6
  ) {
    return true;
  }
  return false;
}

//Entity Generation
export const getRandomIntegerInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//elementInfo: {height:y, width:x, position:[x,y]}
//elementDimension: {height:y, width:x}
export function generateNewCoinCoordenates(
  gridDimension,
  coinDimension,
  heroInfo
) {
  while (true) {
    let x = getRandomIntegerInclusive(
      coinDimension.width,
      gridDimension.width - 6 - coinDimension.width
    );
    let y = getRandomIntegerInclusive(
      coinDimension.height,
      gridDimension.height - 6 - coinDimension.height
    );
    if (
      !overlap(heroInfo, {
        height: coinDimension.height,
        width: coinDimension.width,
        position: [x, y],
      })
    ) {
      return [x, y];
    }
  }
}

export function translateDirection(up, down, left, right) {
  let direction = null;
  if (up && left) {
    direction = (Math.PI * 3) / 4;
  } else if (up && right) {
    direction = Math.PI / 4;
  } else if (down && left) {
    direction = (Math.PI * 5) / 4;
  } else if (down && right) {
    direction = (Math.PI * 7) / 4;
  } else if (up && !down) {
    direction = Math.PI / 2;
  } else if (down && !up) {
    direction = (Math.PI * 3) / 2;
  } else if (left && !right) {
    direction = Math.PI;
  } else if (right && !left) {
    direction = Math.PI * 2;
  }
  return direction;
}
