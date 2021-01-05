window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = '﹖';

    let places = staticLoadPlaces();
    renderPlaces(places);
	
	
};

function staticLoadPlaces() {
    return [
        {
            name: 'Magnemite',
            location: {
                lat: 22.472872,
                lng: 114.232984,
            },
			model: 0,
			id: 'second'
        },
		{
            name: 'Articuno',
            location: {
                lat: 22.471791,
                lng: 114.226374,
            },
			model: 1,
			id: 'first'
        },
    ];
}


var models = [
    {
        url: './assets/magnemite/scene.gltf',
        scale: '0.5 0.5 0.5',
        info: 'Magnemite, Lv. 5, HP 10/10',
        rotation: '0 180 0',
    },
    {
        url: './assets/articuno/scene.gltf',
        scale: '0.2 0.2 0.2',
        rotation: '0 180 0',
        info: 'Articuno, Lv. 80, HP 100/100',
    },
    {
        url: './assets/dragonite/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Dragonite, Lv. 99, HP 150/150',
    },
];

var modelIndex = 0;
var setModel = function (model, entity) {
    if (model.scale) {
        entity.setAttribute('scale', model.scale);
    }

    if (model.rotation) {
        entity.setAttribute('rotation', model.rotation);
    }

    if (model.position) {
        entity.setAttribute('position', model.position);
    }

    entity.setAttribute('gltf-model', model.url);

    const div = document.querySelector('.instructions');
    div.innerText = model.info;
};


function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        let model = document.createElement('a-entity');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
		model.setAttribute('id', place.id);
		
		model.setAttribute('gps-entity-place-added', '');
        setModel(models[place.model], model);

        //model.setAttribute('animation-mixer', '');
		model.setAttribute('minDistance', 50);

        document.querySelector('button[data-action="change"]').addEventListener('click', function () {
            var entity = document.querySelector('[gps-entity-place]');
            modelIndex++;
            var newIndex = modelIndex % models.length;
            setModel(models[newIndex], entity);
			
        });

        scene.appendChild(model);
    });
}

var _firstCheck = false;
AFRAME.registerComponent('rotation-reader', {
  tick: function () {
    // `this.el` is the element.
    // `object3D` is the three.js object.

    // `rotation` is a three.js Euler using radians. `quaternion` also available.
    //console.log(this.el.object3D.rotation);

    // `position` is a three.js Vector3.
    //console.log(this.el.object3D.position);
	
	const div = document.querySelector('.gpsinfo');
	
	let curPos = this.el.object3D.position;
    div.innerText = "x: " + this.el.object3D.position.x + "; z: " + this.el.object3D.position.z;
	
	const scene = document.querySelector('a-scene');
	ent = scene.querySelector('a-entity#first');
	
	if(_firstCheck == true){
		let objPos = ent.getAttribute('position');	
		div.innerText += "\n X: "+ ent.getAttribute('position').x + "\n Z: "+ ent.getAttribute('position').z ;
		
		let dist = Math.sqrt( Math.pow(curPos.x - objPos.x, 2) + Math.pow(curPos.y - objPos.y, 2));
		div.innerText += "\n Dist: " + dist + " m";
		
		let _aDist = ent.getAttribute('distance');
		div.innerText += "\n AttrDist: " + _aDist;
		
		if(_aDist > 50){
			ent.setAttribute('visible', false);
		}else{
			ent.setAttribute('visible', true);
		}
	}
	
  }
});

AFRAME.registerComponent('gps-entity-place-added', {
	init: function(){
		console.log("Added");
		
		if(this.el.id == "first"){
			_firstCheck = true;
		}
		
		/*
		let objPos = this.el.getAttribute('position');	
		let _di = Math.sqrt( Math.pow(curPos.x - objPos.x, 2) + Math.pow(curPos.y - objPos.y, 2));
		if(_di > 50){
			this.el.setAttribute('visible', false);
		}
		*/
	}
});
