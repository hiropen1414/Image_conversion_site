let monochrome_ = false;
let inversion_ = false;
// let horizontal_ = false;
// let vartical_ = false;
let rotate_r_ = false;
let rotate_l_ = false;
let filename = "empty";
let checkbox = document.querySelectorAll('input[type="checkbox"]');
let select = document.getElementById('select');
window.addEventListener("dragover", function (evt) {
	evt.preventDefault();
}, false);
window.addEventListener("drop", function (evt) {
	evt.preventDefault();
	let files = evt.dataTransfer.files[0];
	filename = files.name;
	if (!files.type.match(/^image\/(png|jpeg|heic)$/)) {
		alert("このファイル形式には対応していません。");
		return;
	}
	let reader = new FileReader();
	reader.onload = onFileLoaded;
	reader.readAsDataURL(files);
	document.getElementById("title").innerHTML = `ファイル名:${filename}`;
	reset();
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

}

function createImageData(img) {

	let cv = document.createElement('canvas');

	cv.width = img.naturalWidth;
	cv.height = img.naturalHeight;

	let ct = cv.getContext('2d');

	ct.drawImage(img, 0, 0);

	let data = ct.getImageData(0, 0, cv.width, cv.height);
	origin_img_data = data;
	return data;

}

let img_data;
let origin_img_data;
let base_width;
let base_height;
const deals = {
	"Inversion": function (processed_data, index, img_data) {
		processed_data.data[index] = 255 - img_data.data[index];
		processed_data.data[index + 1] = 255 - img_data.data[index + 1];
		processed_data.data[index + 2] = 255 - img_data.data[index + 2];
	},
	"Monochrome": function (processed_data, index, img_data, origin_img_data) {
		if (monochrome_ == true) {
			let gray = img_data.data[index] * 0.2126 + img_data.data[index + 1] * 0.7152 + img_data.data[index + 2] * 0.0722;
			processed_data.data[index] = gray;
			processed_data.data[index + 1] = gray;
			processed_data.data[index + 2] = gray;
		} else {
			deals["Origin"](processed_data, index, img_data, origin_img_data);
			if (inversion_ === true) {
				deals["Inversion"](processed_data, index, processed_data, origin_img_data);
			}
			if (vartical_ == true) {

			}
		}
	},
	"Origin": (processed_data, index, img_data, origin_img_data, cv, ct) => {
		processed_data.data[index] = origin_img_data.data[index];
		processed_data.data[index + 1] = origin_img_data.data[index + 1];
		processed_data.data[index + 2] = origin_img_data.data[index + 2];
	},
	"Rotate_r": (processed_data, index, img_data, origin_img_data, cv, ct) => {

		let tb = cv.getContext('2d').createImageData(img_data.height, img_data.width);
		let max_index = (img_data.width * img_data.height) * 4;
		for (let i = 0; i < tb.height; i++) {
			for (let s = 0; s < tb.width; s++) {
				// for (let index_ = 0; index_ < 4; index_++) {
				// 	// alert(max_index - (img_data.width - i) * 4 + (img_data.height - s + 1) * 4 * 3 + index_);
				// }
				let index = (s + i * tb.width) * 4
				tb.data[index] = img_data.data[max_index + i * 4 - (s + 1) * img_data.width * 4];//59 + 1 - (列数-列) * 4 + (行数 -行) * 4 * 3
				tb.data[index + 1] = img_data.data[max_index + i * 4 - (s + 1) * img_data.width * 4 + 1];
				tb.data[index + 2] = img_data.data[max_index + i * 4 - (s + 1) * img_data.width * 4 + 2];
				tb.data[index + 3] = img_data.data[max_index + i * 4 - (s + 1) * img_data.width * 4 + 3];
				// alert(tb.data[index] + "/" + tb.data[index + 1] + "/" + tb.data[index + 2] + "/" + tb.data[index + 3]);
			}
		}
		let tmp = cv.width;
		cv.width = cv.height;
		cv.height = tmp;
		return tb;
	}, "Rotate_l": (processed_data, index, img_data, origin_img_data, cv, ct) => {

		let tb = cv.getContext('2d').createImageData(img_data.height, img_data.width);
		let max_index = (img_data.width * img_data.height) * 4;
		for (let i = 0; i < tb.height; i++) {
			for (let s = 0; s < tb.width; s++) {
				// for (let index_ = 0; index_ < 4; index_++) {
				// 	// alert(max_index - (img_data.width - i) * 4 + (img_data.height - s + 1) * 4 * 3 + index_);
				// }
				let index = (s + i * tb.width) * 4
				tb.data[index] = img_data.data[4 * (img_data.width - 1) - i * 4 + (s) * 4 * img_data.width];//59 + 1 - (列数-列) * 4 + (行数 -行) * 4 * 3
				tb.data[index + 1] = img_data.data[4 * (img_data.width - 1) - i * 4 + (s) * 4 * img_data.width + 1];
				tb.data[index + 2] = img_data.data[4 * (img_data.width - 1) - i * 4 + (s) * 4 * img_data.width + 2];
				tb.data[index + 3] = img_data.data[4 * (img_data.width - 1) - i * 4 + (s) * 4 * img_data.width + 3];
				// alert(tb.data[index] + "/" + tb.data[index + 1] + "/" + tb.data[index + 2] + "/" + tb.data[index + 3]);
			}
		}
		let tmp = cv.width;
		cv.width = cv.height;
		cv.height = tmp;
		return tb;
	}, "Vertical": (processed_data, index, img_data, origin_img_data, cv, ct) => {
		let max_index = (img_data.width - 1 + (img_data.height - 1) * img_data.width) * 4;
		for (let y = 0; y < img_data.height / 2; y++) {
			for (let x = 0; x < img_data.width; x++) {
				let index = (x + y * img_data.width) * 4;
				let conv_form = max_index - 4 * (img_data.width * (y + 1) - (x + 1));//変換式。max - (4 * w * y + 4(w - 1 - x)),一項目:y文文
				let tmp_r = img_data.data[index];
				let tmp_g = img_data.data[index + 1];
				let tmp_b = img_data.data[index + 2];
				let tmp_a = img_data.data[index + 3];
				processed_data.data[index] = img_data.data[conv_form];
				processed_data.data[index + 1] = img_data.data[conv_form + 1];
				processed_data.data[index + 2] = img_data.data[conv_form + 2];
				processed_data.data[index + 3] = img_data.data[conv_form + 3];
				processed_data.data[conv_form] = tmp_r;
				processed_data.data[conv_form + 1] = tmp_g;
				processed_data.data[conv_form + 2] = tmp_b;
				processed_data.data[conv_form + 3] = tmp_a;
			}
		}
		return processed_data;
	}, "Horizontal": (processed_data, index, img_data, origin_img_data, cv, ct) => {
		let max_index = (img_data.width - 1 + (img_data.height - 1) * img_data.width) * 4;
		for (let y = 0; y < img_data.height; y++) {
			for (let x = 0; x < img_data.width / 2; x++) {
				let index = (x + y * img_data.width) * 4;
				let conv_form = 4 * (img_data.width * (y + 1) - (x + 1));//変換式。
				let tmp_r = img_data.data[index];
				let tmp_g = img_data.data[index + 1];
				let tmp_b = img_data.data[index + 2];
				let tmp_a = img_data.data[index + 3];
				processed_data.data[index] = img_data.data[conv_form];
				processed_data.data[index + 1] = img_data.data[conv_form + 1];
				processed_data.data[index + 2] = img_data.data[conv_form + 2];
				processed_data.data[index + 3] = img_data.data[conv_form + 3];
				processed_data.data[conv_form] = tmp_r;
				processed_data.data[conv_form + 1] = tmp_g;
				processed_data.data[conv_form + 2] = tmp_b;
				processed_data.data[conv_form + 3] = tmp_a;
			}
		}
		return processed_data;
	}
};

function processImageData(deal_name) {

	let cv = document.getElementById('test_canvas');
	let ct = cv.getContext('2d');

	if (img_data == undefined) {
		img_data = cv.img_data;
		base_width = cv.width;
		base_height = cv.height;
	}
	if (!img_data) {
		alert("画像が選択されていません。");
	}

	if (deal_name == "Origin") {
		cv.width = base_width;
		cv.height = base_height;
	}
	let processed_data = cv.getContext('2d').createImageData(img_data.width, img_data.height);


	// let del_ = cv.getContext('2d');
	// del_.clearRect(0,0,cv.width,cv.height);
	let a = document.getElementById('range').value;
	document.getElementById("opacity").innerHTML = (`${Math.trunc(100 * a / 255)}%`);
	Loop: for (let y = 0; y < img_data.height; y++) {
		for (let x = 0; x < img_data.width; x++) {

			let index = (x + y * img_data.width) * 4;
			if (deal_name != undefined) {
				if (deal_name == "Rotate_r" || deal_name == "Rotate_l" || deal_name == "Vertical" || deal_name == "Horizontal") {
					processed_data = deals[deal_name](processed_data, index, img_data, origin_img_data, cv, ct);
					break Loop;
				} else {
					deals[deal_name](processed_data, index, img_data, origin_img_data, cv);
				}
			} else {
				processed_data.data[index] = img_data.data[index];
				processed_data.data[index + 1] = img_data.data[index + 1];
				processed_data.data[index + 2] = img_data.data[index + 2];
			}
			processed_data.data[index + 3] = a;
		}
	}
	putimage(cv, ct, processed_data, img_data);
	img_data = processed_data;
}

function putimage(cv, ct, processed_data, img_data) {
	ct.putImageData(processed_data, 0, 0);
}

function Settale(img_data) {
	let tb = new Array(img_data.width);
	for (let s = 0; s < img_data.height; s++) {
		tb[s] = new Array(img_data.height * 4).fill(0);
	}
	return tb;
}

function monochrome() {//BT.601規格
	if (monochrome_ === false) {
		monochrome_ = true;
	} else {
		monochrome_ = false;
	}
	processImageData("Monochrome");
}

function color_inversion() {//色調反転

	let button = document.getElementById("but_inv");
	button.addEventListener('mouseout', () => {
		this.style.backgroundColor = "blue";
	});
	if (inversion_ === false) {
		inversion_ = true;
	} else {
		inversion_ = false;
	}
	processImageData("Inversion");
}

function horizontal_inversion() {//左右反転
	// if (horizontal_ === false) {
	// 	horizontal_ = true;
	// } else {
	// 	horizontal_ = false;
	// }
	processImageData("Horizontal");
}

function vartical_inversion() {//上下反転
	// if (vartical_ === false) {
	// 	vartical_ = true;
	// } else {
	// 	vartical_ = false;
	// }
	processImageData("Vertical");
}

function rotate_right() {//右に90度回転
	// if (rotate_r_ === false) {
	// 	rotate_r_ = true;
	// } else {
	// 	rotate_r_ = false;
	// }
	processImageData("Rotate_r");
}

function rotate_left() {//左に９０度回転
	// if (rotate_l_ === false) {
	// 	rotate_l_ = true;
	// } else {
	// 	rotate_l_ = false;
	// }
	processImageData("Rotate_l");
}

function Download() {//ダウンロード
	let cv = document.getElementById('test_canvas');
	let link = document.createElement("a");
	let name_sp = filename.split("").reverse().join("").split(".");//ファイル名を①一文字ずつに分割,②反転,③結合,④.で分割
		name_sp[0] = null;//⑤本来一番後ろにあった拡張子.pngを削除
		name_sp = name_sp.join(".").split("");//⑥.区切りで結合した後、⑦また一文字ずつに分割
		name_sp[0] = null;//⑧先頭の.を削除(~~~._renew.pngみたいになってしまうため)
		name_sp = name_sp.reverse().join("");//⑨反転させ、⑩結合
		link.href = cv.toDataURL(`image/${select.value}`);
	if (!(checkbox[0].checked)) {
		link.download = `${name_sp}_renew.${select.value}`;
	}else{
		link.download = `${name_sp}.${select.value}`;
	}
	link.click();
}

// function replace(index, conv_form, processed_data, img_data) {//入れ替え場所まとめ
// 	let tmp_r = img_data.data[index];
// 	let tmp_g = img_data.data[index + 1];
// 	let tmp_b = img_data.data[index + 2];
// 	processed_data.data[index] = img_data.data[conv_form];
// 	processed_data.data[index + 1] = img_data.data[conv_form + 1];
// 	processed_data.data[index + 2] = img_data.data[conv_form + 2];
// 	processed_data.data[conv_form] = tmp_r;
// 	processed_data.data[conv_form + 1] = tmp_g;
// 	processed_data.data[conv_form + 2] = tmp_b;
// }

function reset() {//reset
	inversion_ = false;
	monochrome_ = false;
	horizontal_ = false;
	vartical_ = false;
	select.selectedIndex = 0;
	checkbox[0].checked = false;
	document.getElementById('range').value = 255;
	processImageData("Origin");
}