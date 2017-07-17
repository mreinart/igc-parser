import * as fs from "fs";

const RE_B = /^B(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{3})([NS])(\d{3})(\d{2})(\d{3})([EW])/;

export interface Fix {
  secOfDay: number,
  coordinate: GeoJSON.Position,
}

export function readFlight(path): Fix[] {
  return fs.readFileSync(path, 'utf8')
    .split('\n')
    .filter(line => line[0] === 'B')
    .map(convertLine)
    .filter(Boolean) as Fix[];
}

function convertLine(line: string): Fix | undefined {
  let match = line.match(RE_B);
  if (!match) return;

  let secOfDay = parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
  let lat = parseInt(match[4]) + parseInt(match[5]) / 60 + parseInt(match[6]) / 60000;
  let lon = parseInt(match[8]) + parseInt(match[9]) / 60 + parseInt(match[10]) / 60000;
  let coordinate = [lon, lat];
  return { secOfDay, coordinate };
}
