// Content grounded in each repository's README (github.com/AmmarYasser455).
// Snippets are copied from the READMEs' own usage sections; `out` lines are documented outputs.
export type CodeLine = { text: string; kind?: 'cmd' | 'code' | 'out' | 'comment' };
export type Project = {
  id: string;
  title: string;
  kind: string;
  description: string;
  tags: string[];
  features: string[];
  problem: string;
  approach: string;
  steps?: string[];
  snippet: { file: string; lang: 'bash' | 'python'; lines: CodeLine[] };
  links: { docs?: string; demo?: string };
};

export const projects: Project[] = [
  {
    id: 'ovc', title: 'Overlap Violation Checker', kind: 'Python library + CLI',
    description: 'Automated spatial quality control for building and road datasets.',
    tags: ['Python', 'GeoPandas', 'Shapely', 'Folium'],
    features: ['Detect overlapping buildings, boundary violations and building-road conflicts.', 'Identify disconnected roads, self-intersections and dangles.', 'Check geometry quality: invalid shapes, unreasonable areas, compactness and setbacks.', 'Export GeoPackage layers, CSV reports and interactive HTML maps.'],
    problem: 'Building and road datasets often arrive with overlapping footprints, buildings sitting on roads and broken road networks. These errors are slow to find by eye and quietly break every analysis built on top of them.',
    approach: 'OVC points at local Shapefile, GeoJSON or GeoPackage data and runs vectorized spatial joins to flag every issue, then exports issue layers, CSV metrics and an interactive web map. It runs fully offline, and can call GeoQA first as a data-readiness gate.',
    snippet: { file: 'terminal', lang: 'bash', lines: [
      { text: 'python scripts/run_qc.py \\', kind: 'cmd' },
      { text: '  --buildings buildings.shp \\', kind: 'code' },
      { text: '  --roads roads.shp --out outputs', kind: 'code' },
      { text: 'building_qc/building_qc.gpkg', kind: 'out' },
      { text: 'building_qc/building_qc_map.html', kind: 'out' },
      { text: 'building_qc/building_qc_metrics.csv', kind: 'out' },
    ] },
    links: { docs: 'https://ammaryasser455.github.io/ovc/' },
  },
  {
    id: 'ovc-arcgis-pro', title: 'OVC for ArcGIS Pro', kind: 'ArcGIS Pro Python Toolbox',
    description: 'Spatial quality checks inside a native ArcGIS Pro toolbox.',
    tags: ['Python', 'ArcPy', 'ArcGIS Pro'],
    features: ['Run five building and road quality tools from the Geoprocessing pane.', 'Classify building overlaps as duplicate, partial or sliver.', 'Find road dangles with O(n) spatial-hash endpoint matching.', 'Auto-project geographic data to UTM and add results to the map.'],
    problem: 'GIS teams in government, utilities and consulting need reliable QC checks without leaving ArcGIS Pro or installing external dependencies.',
    approach: 'A native Python Toolbox built only on ArcPy. It shares overlap thresholds, UTM auto-projection and the spatial-index approach with the OVC Python library, so results match whichever tool you run.',
    snippet: { file: 'OVCToolbox.pyt', lang: 'bash', lines: [
      { text: '# Geoprocessing › Overlap Violation Checker', kind: 'comment' },
      { text: 'Building Overlap Checker', kind: 'out' },
      { text: 'Building-Road Conflict Checker', kind: 'out' },
      { text: 'Road Dangle Checker', kind: 'out' },
      { text: 'Road Disconnected Segment Checker', kind: 'out' },
      { text: 'Road Self-Intersection Checker', kind: 'out' },
    ] },
    links: {},
  },
  {
    id: 'geoqa', title: 'GeoQA', kind: 'Python package + CLI',
    description: 'Profile geospatial data, assess quality and create interactive reports.',
    tags: ['Python', 'Data quality', 'HTML reports'],
    features: ['Inspect geometry validity, empty features and duplicate geometries.', 'Analyze attribute completeness and dataset statistics.', 'Score each dataset from 0 to 100.', 'Generate self-contained HTML quality reports and act as an OVC pre-check.'],
    problem: 'Before any analysis you need to know whether a dataset is fit for use: valid geometry, complete attributes and a defined coordinate system.',
    approach: 'One line profiles any vector dataset. GeoQA scores it from 0 to 100 (geometry validity, attribute completeness, CRS, empty geometries), highlights issues on an interactive map and writes a self-contained HTML report.',
    snippet: { file: 'python', lang: 'python', lines: [
      { text: 'import geoqa', kind: 'code' },
      { text: 'profile = geoqa.profile("buildings.shp")', kind: 'code' },
      { text: 'profile.summary()', kind: 'code' },
      { text: 'profile.show_map()', kind: 'code' },
      { text: 'profile.to_html("quality_report.html")', kind: 'code' },
    ] },
    links: { docs: 'https://ammaryasser455.github.io/geoqa/' },
  },
  {
    id: 'Cairo-Hex-Grid-Analysis-using-Python', title: 'Cairo Hex Grid Analysis', kind: 'Spatial analysis package',
    description: 'Explore amenity density, diversity and hotspots with a hexagonal grid.',
    tags: ['OSM', 'OSMnx', 'DBSCAN', 'Folium'],
    features: ['Fetch OpenStreetMap amenities and aggregate them into hexagons.', 'Score density and diversity with configurable weights.', 'Detect cafe clusters with DBSCAN.', 'Export GeoJSON layers and an interactive map.'],
    problem: 'How evenly are everyday services spread across a city, and where do they cluster?',
    approach: 'The analysis downloads amenities from OpenStreetMap, builds a projected hex grid, scores each cell on density and diversity, and finds hotspots with DBSCAN. It works for any city, not only Cairo.',
    steps: ['Fetch amenities inside the place boundary.', 'Build flat-top hexagons in EPSG:3857.', 'Count amenities and unique types per cell.', 'Normalize density and diversity into a score.', 'Cluster cafe hotspots with DBSCAN.', 'Render an interactive heatmap, hex layer and markers.'],
    snippet: { file: 'terminal', lang: 'bash', lines: [
      { text: 'python run_analysis.py \\', kind: 'cmd' },
      { text: '  --place "Alexandria, Egypt" --radius 300', kind: 'code' },
      { text: 'cairo_hexgrid.geojson', kind: 'out' },
      { text: 'hotspots.geojson', kind: 'out' },
      { text: 'cairo_hex_map.html', kind: 'out' },
    ] },
    links: { demo: 'https://cairo-hex-analysis-by-ammaryasser.netlify.app/' },
  },
  {
    id: 'GeoNest', title: 'GeoNest', kind: 'Python library (PyPI)',
    description: 'A lightweight Python library for interactive maps in Jupyter.',
    tags: ['Python', 'ipyleaflet', 'Jupyter'],
    features: ['Add vector datasets and raster layers to notebook maps.', 'Switch basemaps and connect WMS layers.', 'Use interactive layer controls and media overlays.'],
    problem: 'Interactive maps in Jupyter usually take a lot of ipyleaflet setup before you can look at your data.',
    approach: 'GeoNest extends ipyleaflet.Map with one-line methods for basemaps, GeoJSON, GeoDataFrames, GeoTIFF rasters, WMS layers and media overlays.',
    snippet: { file: 'python', lang: 'python', lines: [
      { text: 'from geonest import Map', kind: 'code' },
      { text: 'm = Map(center=[30.0, 31.0], zoom=6)', kind: 'code' },
      { text: 'm.add_basemap("OpenTopoMap")', kind: 'code' },
      { text: 'm.add_gdf(gdf)', kind: 'code' },
      { text: 'm.add_layer_control()', kind: 'code' },
    ] },
    links: {},
  },
];
