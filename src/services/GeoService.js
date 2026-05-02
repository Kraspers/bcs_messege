export class GeoService {
  metroRoutes({ from, to }) {
    return {
      from,
      to,
      lines: ['Blue', 'Green'],
      transfers: 1,
      arrivalMin: 12
    };
  }
}
