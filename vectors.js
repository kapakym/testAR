export class Vector {
  x = 0;
  y = 0;
  z = 0;

  constructor(coordinate) {
    this.x = coordinate.x;
    this.y = coordinate.y;
    this.z = coordinate.z;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getZ() {
    return this.z;
  }

  getXYZ() {
    return { x: this.x, y: this.y, z: this.z };
  }

  sub(vector) {
    return { x: this.x - vector.x, y: this.y - vector.y, z: this.z - vector.z };
  }

  add(vector) {
    return { x: this.x + vector.x, y: this.y + vector.y, z: this.z + vector.z };
  }

  multyVectorOnScalar(scalar) {
    this.x = this.x * scalar;
    this.y = this.y * scalar;
    this.z = this.z * scalar;
  }

  lengthVector(vector) {
    console.log(vector);
    return Math.sqrt(
      Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2)
    );
  }

  length() {
    return this.lengthVector(this.getXYZ());
  }

  distance(vector) {
    return this.lengthVector(this.sub(vector));
  }

  normal(vector) {
    const len = this.lengthVector(vector);
    console.log(len)
    return { x: vector.x / len, y: vector.y / len, z: vector.z / len };
  }

  multiScalarVectors(vector, vector2) {
    return (vector.x * vector2.x) + (vector.y * vector2.y) + (vector.z * vector2.z);
  }

  getTheta(vector) {
    const norm1 = this.normal(this.getXYZ());
    console.log(norm1)
    const norm2 = this.normal(vector);
    console.log(norm2)
    console.log("----->",Math.acos(this.multiScalarVectors(norm1, norm2)))
    return Math.acos(this.multiScalarVectors(norm1, norm2)*180/Math.PI);
  }
}
