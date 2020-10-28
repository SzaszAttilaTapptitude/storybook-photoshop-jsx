#include save-image.jsx
#include get-layers.jsx

function saveBackgroundImage(options) {
    var storybook = Folder.selectDialog("select folder"); // select folder that has folders of psd files in it

    if (storybook) {

        var storyFolders = storybook.getFiles(function(f) { return f instanceof Folder; });

        //individual story folder
        for (var m = 0; m < storyFolders.length; m++) {

            try {
                var theFiles = storyFolders[m].getFiles("*.psd");
            } catch (e) {
                var theFiles = [];
            }

            //individual file
            for (var n = 0; n < theFiles.length; n++) {

                app.open(File(theFiles[n]))
                var doc = app.activeDocument;

                //folder for processed files
                f = new Folder(doc.path + "_jpg/");

                if (!f.exists) {
                    f.create();
                }

                //automatic resizing so that width is 1024 and height is scaled by same amount
                if (doc.width > 1024) {
                	var ratio = UnitValue(1024,"px")/doc.width;
                    var width = UnitValue(1024,"px");
                    var height = UnitValue(Math.round(ratio*doc.height),"px");
                    
		            doc.resizeImage(width,height,null,ResampleMethod.BICUBIC);
		            doc.resizeCanvas(width,height);
		        }


                //only show background and textbox layers
                //get textbox location for naming
                var layerData = getLayerData();
                var layers = layerData.layers;

                var type = '';
                var bg_present = false;

                //hideAllLayers();

                for (var i=0; i < layers.length; i++) {
                    var layer = layers[i];


                    switch (layer.type) {
                        case 'TL':
                            type = '_tl';
                            showLayerWithLayerName(layer.name);
                            break;
                        case 'TR':
                            type = '_tr';
                            showLayerWithLayerName(layer.name);
                            break;
                        case 'BL':
                            type = '_bl';
                            showLayerWithLayerName(layer.name);
                            break;
                        case 'BR':
                            type = '_br';
                            showLayerWithLayerName(layer.name);
                            break;
                        case 'BG':
                        	if (bg_present) {
                        		alert("Two backgrounds");
                        		alert(doc.name);
                        	}
                            bg_present = true;
                            showLayerWithLayerName(layer.name);
                            break;
                        default:
                        	hideLayerWithLayerName(layer.name);
                            break;
                    }
                }

                if (!bg_present) {
                	alert("No background");
                    alert(doc.name);
                }

                //save the renamed / edited file to the jpg folder
                var name = doc.path + "_jpg/" + doc.name.slice(0, doc.name.length-4) + type + '.jpg';
                saveJpeg(name);
            }
        }
    }
    alert("Done Processing.");
}

function showAllLayers() {
    var doc = app.activeDocument;
    for(var i = 0 ; i < doc.layers.length;i++){
    	if (doc.layers[i].visible != 1) {
	        doc.layers[i].visible = 1;
    	}
	}
}

function hideAllLayers() {
    var doc = app.activeDocument;
    for(var i = 0 ; i < doc.layers.length;i++){
    	if (doc.layers[i].visible != 0) {
        	doc.layers[i].visible = 0;
    	}
    }
}

function showLayerWithLayerName(layerName) {
    var doc = app.activeDocument;
    var layer = doc.layers.getByName(layerName);
    if (layer.visible != 1) {
    	layer.visible = 1;
	}
}

function hideLayerWithLayerName(layerName) {
    var doc = app.activeDocument;
    var layer = doc.layers.getByName(layerName);
    if (layer.visible != 0) {
    	layer.visible = 0;
	}
}