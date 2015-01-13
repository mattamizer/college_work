/*
	Feel free to use your custom /webapps/cmsmain/static/images/icons for the tree. Make sure they are all of the same size.
	If you don't use some keys you can just remove them from this config
*/

var TREE_TPL = {

	// general
	'target':'_self',	// name of the frame links will be opened in
						// other possible values are:
						// _blank, _parent, _search, _self and _top

	// /webapps/cmsmain/static/images/icons - root	
	'icon_48':'/images/ci/icons/home_li.gif',   // root icon normal
	'icon_52':'/images/ci/icons/home_li.gif',   // root icon selected
	'icon_56':'/images/ci/icons/home_li.gif',   // root icon opened
	'icon_60':'/images/ci/icons/home_li.gif',   // root icon selected opened

	// /webapps/cmsmain/static/images/icons - node	
	'icon_16':'/images/ci/icons/folderopen_ti.gif', // node icon normal
	'icon_20':'/images/ci/icons/folderopen_ti.gif', // node icon selected
	'icon_24':'/images/ci/icons/folderopen_ti.gif', // node icon opened
	'icon_28':'/images/ci/icons/folderopen_ti.gif', // node icon selected opened

	// /webapps/cmsmain/static/images/icons - leaf
	'icon_0':'/images/ci/icons/document_li.gif', // leaf icon normal
	'icon_4':'/images/ci/icons/document_li.gif', // leaf icon selected

	// /webapps/cmsmain/static/images/icons - junctions	
	'icon_2':'/images/ci/icons/treecontrol/joinbottom.gif', // junction for leaf
	'icon_3':'/images/ci/icons/treecontrol/join.gif',       // junction for last leaf
	'icon_18':'/images/ci/icons/treecontrol/plusbottom.gif', // junction for closed node
	'icon_19':'/images/ci/icons/treecontrol/plus.gif',       // junctioin for last closed node
	'icon_26':'/images/ci/icons/treecontrol/minusbottom.gif',// junction for opened node
	'icon_27':'/images/ci/icons/treecontrol/minus.gif',      // junctioin for last opended node

	// /webapps/cmsmain/static/images/icons - misc
	'icon_e':'/images/ci/icons/treecontrol/empty.gif', // empty image
	'icon_l':'/images/ci/icons/treecontrol/line.gif'  // vertical line
	
	// make sure there is no comma after the last key-value pair
};

function expand_all (o_tree) {
    
    // set to true when debugging the application
    var B_DEBUG = true;

    if (!o_tree) 
        o_tree = (TREES[0]);
    if (!o_tree)
      return (B_DEBUG
        ? alert("No Tree instances can be found on this page")
        : false
      );
    
    if (o_tree.a_children[0].a_children) {
        if ( typeof(o_tree.a_children[0].a_children.length) != "undefined") {
            for (var i = 0; i < o_tree.a_children.length; i++) {        
                o_tree.a_children[i].open();
                open_child(o_tree.a_children[i]);
            }
        }
    }       
}

function open_child (c_of_this) {
                   
    for (var x = 0; x < c_of_this.a_children.length; x++) {             
        //alert("recursing for "+ c_of_this.a_children[x].n_node_id);            
        if ( typeof(c_of_this.a_children[x].n_node_id) != "undefined") {
            c_of_this.a_children[x].open();                
            open_child (c_of_this.a_children[x]);        
        }
    }  

}

function colapse_all (o_tree) {
    
    // set to true when debugging the application
    var B_DEBUG = true;

    //alert("found "+ TREES.length +" trees on this page");

    if (!o_tree) 
        o_tree = (TREES[0]);
    if (!o_tree)
      return (B_DEBUG
        ? alert("No Tree instances can be found on this page")
        : false
      );
    
    if (o_tree.a_children[0].a_children) {
        if ( typeof(o_tree.a_children[0].a_children.length) != "undefined") {
            for (var i = 0; i < o_tree.a_children.length; i++) {        
                //alert("root of tree has "+ o_tree.a_children.length +" nodes ");
                o_tree.a_children[i].open(true);
                close_child(o_tree.a_children[i]);
            }
        }   
    }
}

function collapse_almost_all (n_index, n_depth) {
	var o_tree = TREES[0];
	if (!n_depth) n_depth = 1;
	if (!o_tree)
		alert("Tree is not initialized yet");
	var a_nodes = o_tree.a_nodes;
	for (var i = a_nodes.length - 1; i >= 0; i--)
		if (a_nodes[i].n_depth >= n_depth && a_nodes[i].open)
			a_nodes[i].open(1, 1);
	o_tree.ndom_refresh();
}


function close_child (c_of_this) {                  

    for (var x = 0; x < c_of_this.a_children.length; x++) {             
        //alert("recursing for "+ c_of_this.a_children[x].n_node_id);            
        if ( typeof(c_of_this.a_children[x].n_node_id) != "undefined") {
            c_of_this.a_children[x].open(true);                
            close_child (c_of_this.a_children[x]);        
        }
    }

}
