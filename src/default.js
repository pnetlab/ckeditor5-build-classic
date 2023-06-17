
global.isset = (obj)=>{
	if(typeof(obj) == 'undefined' || obj == null ){
		return false;
	}
	return true;
}

global.get = (obj, def)=>{
	if(isset(obj)){
		return obj;
	}else{
		return def;
	}
}

global.count=(obj)=>{
	return Object.keys(obj).length;
}


global.findAncestor = ( parentName, position )=>{
	let parent = position.parent;

	while ( parent ) {
		if ( parent.name === parentName ) {
			return parent;
		}

		parent = parent.parent;
	}
}

global.getValidChild = (parent, attribute, editor)=>{
	// in model mode
	// find recuse childrens of parent contain attribute.
	var validChilds = [];
	try {
		if(editor.model.schema.checkAttribute( parent, attribute )){
			validChilds.push(parent);
		}
		
		if(parent.childCount == 0) return validChilds; 
		
		for (let child of parent.getChildren()){
			var result = getValidChild(child, attribute, editor);
			validChilds = validChilds.concat(result);
		}
		
		return validChilds;
	} catch (e) {
		return validChilds;
	}
}


global.findChildren = (parent, conditions)=>{ 
	// in model mode
	// find recuse childrens of parent match name.
	var validChilds = [];
	try {
		
		if(typeof(conditions)=='function' && conditions(parent)){
			validChilds.push(parent);
		}
		
		for (let child of parent.getChildren()){
			var result = findChildren(child, conditions);
			validChilds = validChilds.concat(result);
		}
		
		return validChilds;
	
	} catch (e) {
		//console.log(e);
		return validChilds;
	}
	
}

global.findFirstChild = (parent, conditions)=>{ 
	// in model mode
	// find recuse childrens of parent match name.
	try {
		
		if(typeof(conditions)=='function' && conditions(parent)){
			return parent
		}
		
		for (let child of parent.getChildren()){
			var result = findFirstChild(child, conditions);
			if(result != null) return result;
		}
		
		return null;
	
	} catch (e) {
		//console.log(e);
		return null;
	}
	
}

global.findParent = (child, conditions)=>{ 
	// in model mode
	// find recuse childrens of parent match name.
	
		let parent = child.parent;
	
		while ( parent ) {
			
			try {
				if(typeof(conditions)=='function' && conditions(parent)){
					return parent;
				}
			} catch (e) {}
			
			parent = parent.parent;
		}
		
		return null;
}


global.makeId=(min, max)=>{
	if(typeof max == 'undefined') max = 999;
	if(typeof min == 'undefined') min = 100;
	return Date.now()+''+(Math.floor(Math.random() * (max - min + 1)) + min);
}