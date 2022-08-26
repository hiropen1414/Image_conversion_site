let inversion_ = false;
let monochrome_ = false;
let horizontal_ = false;
let vartical_ = false;
let filename = "empty";
window.addEventListener("dragover", function (evt) {
	evt.preventDefault();
}, false);
window.addEventListener("drop", function (evt) {
	evt.preventDefault();
	let files = evt.dataTransfer.files[0];
	filename = files.name;
	if (!files.type.match(/^image\/(png|jpeg)$/)) {
		alert("このファイル形式には対応していません。");
		return;
	}
	let reader = new FileReader();
	reader.onload = onFileLoaded;
	reader.readAsDataURL(files);
	document.getElementById("title").innerHTML = `ファイル名:${filename}`;
});

function onFileSelected(input) {
	let file = input.files[0];
	filename = file.name;
	let reader = new FileReader();
	reader.onload = onFileLoaded;
	reader.readAsDataURL(file);
	document.getElementById("title").innerHTML = `ファイル名:${filename}`;
}

function onFileLoaded(e) {

	let src_data = e.target.result;

	let img = new Image();

	img.onload = onImageSetted;
	img.src = src_data;

}

function onImageSetted(e) {

	let img_data = createImageData(e.target);

	document.getElementById('test_canvas').width = img_data.width;
	document.getElementById('test_canvas').height = img_data.height;

	document.getElementById('test_canvas').getContext('2d').putImageData(img_data, 0, 0);

	document.getElementById('test_canvas').img_data = img_data;

	document.getElementById('test_canvas').addEventListener('click', processImageData);
	document.getElementById('test_canvas').addEventListener('click', con);

}

function createImageData(img) {

	let cv = document.createElement('canvas');

	cv.width = img.naturalWidth;
	cv.height = img.naturalHeight;

	let ct = cv.getContext('2d');

	ct.drawImage(img, 0, 0);

	let data = ct.getImageData(0, 0, cv.width, cv.height);

	return data;

}



function processImageData(e) {

	let cv = document.getElementById('test_canvas');
	let ct = cv.getContext('2d');

	let img_data = cv.img_data;

	if (!img_data) {
		alert("画像が選択されていません。");
	}
	
	let processed_data = cv.getContext('2d').createImageData(img_data.width, img_data.height);
	// let del_ = cv.getContext('2d');
	// del_.clearRect(0,0,cv.width,cv.height);
	let a = document.getElementById('range').value;
	document.getElementById("opacity").innerHTML = (`${Math.trunc(100 * a / 255)}%`);
	for (let y = 0; y < img_data.height; y++) {
		for (let x = 0; x < img_data.width; x++) {

			let index = (x + y * img_data.width) * 4;
			if (inversion_ === true) {
				processed_data.data[index] = 255 - img_data.data[index];
				processed_data.data[index + 1] = 255 - img_data.data[index + 1];
				processed_data.data[index + 2] = 255 - img_data.data[index + 2];
			} else {
				processed_data.data[index] = img_data.data[index];
				processed_data.data[index + 1] = img_data.data[index + 1];
				processed_data.data[index + 2] = img_data.data[index + 2];
			}
			if (monochrome_ === true) {
				let gray = processed_data.data[index] * 0.299 + processed_data.data[index + 1] * 0.587 + processed_data.data[index + 2] * 0.1114;
				processed_data.data[index] = gray;
				processed_data.data[index + 1] = gray;
				processed_data.data[index + 2] = gray;
			}
			processed_data.data[index + 3] = a;
		}
	}
	let max_index = (img_data.width - 1 + (img_data.height - 1) * img_data.width) * 4;
	if (vartical_ === true) {
		for (let y = 0; y < img_data.height / 2; y++) {
			for (let x = 0; x < img_data.width; x++) {
				let index = (x + y * img_data.width) * 4;
				let conv_form = max_index - 4 * (img_data.width * (y + 1) - (x + 1));//変換式。max - (4 * w * y + 4(w - 1 - x)),一項目:y文文
				replace(index, conv_form, processed_data);
			}
		}
	}
	if (horizontal_ === true) {
		for (let y = 0; y < img_data.height; y++) {
			for (let x = 0; x < img_data.width / 2; x++) {
				let index = (x + y * img_data.width) * 4;
				let conv_form = 4 * (img_data.width * (y + 1) - (x + 1));//変換式。
				replace(index, conv_form, processed_data);
			}
		}
	}
	putimage(cv, ct, processed_data, img_data);
	
}

function putimage(cv, ct, processed_data, img_data) {
	ct.putImageData(processed_data, 0, 0);
}
// function convert(){
// 	let cv = document.getElementById('test_canvas');
// 	let ct = cv.getContext('2d');
// 	let img_data = cv.img_data;
// 	if (!img_data) {
// 		alert("aa");
// 	}
// 	// let processed_data = cv.getContext('2d').createImageData(img_data.width, img_data.height);

// 	if (vartical_ === true) {
// 		for (let y = 0; y <= img_data.height / 2; y++) {
// 			for (let x = 0; x < img_data.width; x++) {
// 				let index = (x + y * img_data.width) * 4;
// 				let conv_form = max_index + 4 * (-1 * img_data.width * (y + 1) + (x + 1));//変換式。max - (4 * w * y + 4(w - 1 - x)),一項目:y文文
// 				replace(index,conv_form,processed_data);
// 			}
// 		}
// 		vartical_=false;
// 	}
// 	if (horizontal_ === true) {
// 		for (let y = 0; y <= img_data.height; y++) {
// 			for (let x = 0; x < img_data.width / 2; x++) {
// 				let index = (x + y * img_data.width) * 4;
// 				let conv_form = 4 * (img_data.width * (y + 1) - (x - 1));//変換式。
// 				replace(index,conv_form,processed_data);
// 			}
// 		}
// 		horizontal_=false;
// 	}
// 	ct.putImageData(processed_data, 0, 0);
// }
function monochrome() {//BT.601規格
	if (monochrome_ === false) {
		monochrome_ = true;
	} else {
		monochrome_ = false;
	}
	processImageData();
}

function color_inversion() {//色調反転
	if (inversion_ === false) {
		inversion_ = true;
		let button = document.getElementById("but_inv");
		button.addEventListener('mouseout',() => {
			this.style.backgroundColor = "blue";
		});
	} else {
		inversion_ = false;

	}

	processImageData();
}

function horizontal_inversion() {//左右反転
	if (horizontal_ === false) {
		horizontal_ = true;
	} else {
		horizontal_ = false;
	}
	processImageData();
}

function vartical_inversion() {//上下反転
	if (vartical_ === false) {
		vartical_ = true;
	} else {
		vartical_ = false;
	}
	processImageData();
}

function Download() {//ダウンロード
	let cv = document.getElementById('test_canvas');
	let link = document.createElement("a");
	let name_sp = filename.split("").reverse().join("").split(".");//ファイル名を①一文字ずつに分割,②反転,③結合,④.で分割
	name_sp[0] = null;//⑤本来一番後ろにあった拡張子.pngを削除
	name_sp = name_sp.join(".").split("");//⑥.区切りで結合した後、⑦また一文字ずつに分割
	name_sp[0] = null;//⑧先頭の.を削除(~~~._renew.pngみたいになってしまうため)
	name_sp = name_sp.reverse().join("");//⑨反転させ、⑩結合

	link.href = cv.toDataURL("image/png");
	link.download = `${name_sp}_renew.png`;
	link.click();
}

function replace(index, conv_form, processed_data) {//入れ替え場所まとめ
	let tmp_r = processed_data.data[index];
	let tmp_g = processed_data.data[index + 1];
	let tmp_b = processed_data.data[index + 2];
	processed_data.data[index] = processed_data.data[conv_form];
	processed_data.data[index + 1] = processed_data.data[conv_form + 1];
	processed_data.data[index + 2] = processed_data.data[conv_form + 2];
	processed_data.data[conv_form] = tmp_r;
	processed_data.data[conv_form + 1] = tmp_g;
	processed_data.data[conv_form + 2] = tmp_b;
}

function reset() {//reset
	inversion_ = false;
	monochrome_ = false;
	horizontal_ = false;
	vartical_ = false;
	document.getElementById('range').value = 255;
	processImageData();
}