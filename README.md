# [Outdoorman Project](https://outdoorman-project.vercel.app/)
**An open platform where outdoorsmen can publish stories, combining texts with map.**
  
![index-overview](https://github.com/avery710/OUTDOORMAN-PROJECT/blob/f5f7fd34f18631fc126f0513783d0c10b483a836/public/README/index-overview.png)
## Technique Overview
- #### React
  - React Hooks
  - Reack Context
- #### TypeScript
- #### Next.js
  - SSG (Static Side Generation)
  - ISR (Incremental Static Regeneration)
- #### Vercel
- #### Firebase
  - Firestore Database
  - Authentication
  - Storage
- #### styled-components
## Architecture
- #### Integrated [Leaflet](https://leafletjs.com/) map and [Tiptap](https://tiptap.dev/) text-editor to develop main features
  ![architecture](https://github.com/avery710/OUTDOORMAN-PROJECT/blob/f7afa7f7cae2a1303bff7a5b7ced05aa58898ee8/public/README/architecture.jpg)
## Highlights
- #### Mark selected texts with geo location
  While editing your stories, you can select texts and add geo location just as the way of adding links. The marker with description & location will then show up on the map. Besides, your afterwards modification on texts will be syncing on the map.  
    
  ![add-geolink](https://github.com/avery710/OUTDOORMAN-PROJECT/blob/f5f7fd34f18631fc126f0513783d0c10b483a836/public/README/demo-geolink.gif)
- #### Upload your gpx file & Add waypoints to text-editor
  After uploading your GPX file to the map, you can add the descriptions of waypoints to the text-editor. Next time when you click on the added text, the map will centralize the corresponding marker.  
  
  ![add-waypoints](https://github.com/avery710/OUTDOORMAN-PROJECT/blob/f5f7fd34f18631fc126f0513783d0c10b483a836/public/README/demo-waypoints.gif)
- #### Publish your story & Read along with map
  While reading the published stories, you can quickly grasp the precise location of what the texts are describing simply just by clicking the texts with geo-link.  
  
  ![read](https://github.com/avery710/OUTDOORMAN-PROJECT/blob/f5f7fd34f18631fc126f0513783d0c10b483a836/public/README/demo-read.gif)
## Other Features
- #### Draw and plan for your next adventure
  ![draw](https://github.com/avery710/OUTDOORMAN-PROJECT/blob/f5f7fd34f18631fc126f0513783d0c10b483a836/public/README/demo-draw.gif)
- #### Switch map layers to obtain diverse information about mountains
  ![switch-layers](https://github.com/avery710/OUTDOORMAN-PROJECT/blob/f5f7fd34f18631fc126f0513783d0c10b483a836/public/README/demo-switch-layers.gif)
- #### Get detailed information on all mountains categorized by altitude
  ![mountains](https://github.com/avery710/OUTDOORMAN-PROJECT/blob/f5f7fd34f18631fc126f0513783d0c10b483a836/public/README/demo-mountains.gif)
## Interaction Between Text-editor & Map
- #### Build multiple map layers while iniatilizing the page to prevent the base map from re-rendering.
  ![edit-page-structure](https://github.com/avery710/OUTDOORMAN-PROJECT/blob/73174c3844af4e6b7230292c2413dc024a853922/public/README/edit-page.jpg)
## Pages Structure
- #### Used Next.js ( [SSG](https://nextjs.org/docs/basic-features/data-fetching/get-static-props) & [ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) ) to pre-render public pages
  ![page-structure](https://github.com/avery710/OUTDOORMAN-PROJECT/blob/324e317b8816cafec1e38e9277c8d80a74bb154c/public/README/page-structure.jpg)
