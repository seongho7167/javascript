
import Pagination from '../../demo_module/pagination/pagination_module.js';

(function(){
	let now_page_input = document.querySelector('#now_page_input');
	let total_cnt_input = document.querySelector('#total_cnt_input');
	let page_size_input = document.querySelector('#page_size_input');
	let block_size_input = document.querySelector('#block_size_input');
	let total_page_input = document.querySelector('#total_page_input');
	let input_tag = document.querySelectorAll('input[type="text"]');
	
	input_tag.forEach((input) => {
		input.addEventListener('change', function(e){
			let page_size = Number(page_size_input.value);
			let total_cnt = Number(total_cnt_input.value);
		});
	});
	
	document.querySelector('#create_pagination_btn').addEventListener('click', function(e){
		let now_page = Number(now_page_input.value);
		let total_cnt = Number(total_cnt_input.value);
		let page_size = Number(page_size_input.value);
		if(page_size === 0){page_size = 20;}
		let block_size = Number(block_size_input.value);
		if(block_size === 0){block_size = 10;}
		
		let total_page = Number(total_page_input.value);
		total_page = Math.ceil(total_cnt / page_size);
		total_page_input.value = total_page;
		page_size_input.value = page_size;
		block_size_input.value = block_size;
		
		if(!Number.isInteger(now_page) || !Number.isInteger(total_cnt)){
			alert('error: now_page or total_cnt is empty');
		}else {
			if(now_page > 0 && total_cnt > 0){
				if(now_page <= total_page){
					let pagination_config = {
						now_page: now_page,
						total_cnt: total_cnt,
						page_size: page_size,
						block_size: block_size,
					};

					const pagination = new Pagination('', pagination_config);
				}else {
					alert('error: total_page have to be bigger than now_page');
				}
			}else {
				alert('error: input value have to be bigger than 0');
			}
			
		}
		
	});
	// const pagination = new Pagination('.paginationWrapper', {now_page: 1, total_cnt: 1000});
})()