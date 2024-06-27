interface Uea {
  name: string;
  id: string;
  credits: number;
  trimestre: number;
  seritation: string[];
}

interface UeaOptativa {
  id: number;
  uea: string;
  credits: number;
}
