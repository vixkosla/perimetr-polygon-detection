export const destinationPoint = (
  lat: number,
  lon: number,
  distance: number,
  bearing: number,
) => {
  const R = 6371000;
  const br = (bearing * Math.PI) / 180;
  const lat1 = (lat * Math.PI) / 180;
  const lon1 = (lon * Math.PI) / 180;
  const dr = distance / R;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(dr) +
      Math.cos(lat1) * Math.sin(dr) * Math.cos(br),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(br) * Math.sin(dr) * Math.cos(lat1),
      Math.cos(dr) - Math.sin(lat1) * Math.sin(lat2),
    );

  return { lat: (lat2 * 180) / Math.PI, lon: (lon2 * 180) / Math.PI };
};
