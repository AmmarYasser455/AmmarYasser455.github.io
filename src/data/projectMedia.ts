export type ProjectMedia = {src:string;alt:string;caption:string};
export const projectCovers:Record<string,ProjectMedia> = {
 ovc:{src:'/images/projects/ovc-logo.webp',alt:'OVC — Overlap Violation Checker logo',caption:'Overlap Violation Checker'},
 'ovc-arcgis-pro':{src:'/images/projects/arcgis-building-overlap.png',alt:'ArcGIS Pro showing building overlaps highlighted in red',caption:'Building overlap detection in ArcGIS Pro'},
 geoqa:{src:'/images/projects/geoqa-logo.webp',alt:'GeoQA logo',caption:'GeoQA'}
};
export const projectGalleries:Record<string,ProjectMedia[]> = {
 ovc:[
 {src:'/images/projects/ovc-buildings.jpg',alt:'OVC building quality-control results map',caption:'Building quality-control results'},
 {src:'/images/projects/ovc-roads.jpg',alt:'OVC road quality-control results map',caption:'Road quality-control results'}
 ],
 'ovc-arcgis-pro':[projectCovers['ovc-arcgis-pro'],{src:'/images/projects/arcgis-road-conflict.png',alt:'ArcGIS Pro Building-Road Conflict Checker with conflicting building edges highlighted in yellow',caption:'Building-road conflicts in ArcGIS Pro'}]
};
