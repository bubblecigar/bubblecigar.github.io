
function make_node(num){

	var new_node = document.getElementById("block_tem").content.cloneNode(true);
	var grid_items = new_node.querySelectorAll("span");

	for (var i in grid_items){
		grid_items[i].textContent = `${num} × ${i} = ${num*i}`;
	}

	grid_items[0].textContent = num;

	return new_node;
}

function make_table(){
	for (i=2;i<10;i++){
		var new_node = make_node(i);
		document.querySelector("body").insertBefore(new_node,document.getElementById("block_tem"));
	}
}

make_table();