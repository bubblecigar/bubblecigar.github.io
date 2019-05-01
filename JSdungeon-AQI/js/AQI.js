
function fecthData(){

	const heroku = `https://cors-anywhere.herokuapp.com/`;
	const url = `${heroku}http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$orderby=SiteName&$skip=0&$top=1000&format=json`;
	var dataBase = [];
	
	fetch(url)
	.then(response=>{
		return response.json();
	})
	.then(promise=>{
		const ar = JSON.parse(JSON.stringify(promise));
		console.log(ar);
		store.set('AQI',ar);
		vue.data = ar;
		vue.fetchFinished = true;

		let date = new Date();
		let str = '';
		str = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()} 更新`;
		vue.updateString = str;
	})
	.catch(er=>{
		console.log(er);
	});
	return []
}


const vue = new Vue({
	el:'#bodyWrap',
	data:{
		fetchFinished: false,
		data: fecthData(),
		showMenu: false,
		selectedCounty: '請選擇地區',
		updateString: '',
		selectedSite: {
			County: '',
			SiteName: '--',
			AQI: '--',
			O3: '--',
			PM10: '--',
			'PM2.5': '--',
			CO: '--',
			SO2: '--',
			NO2: '--',
			status: ''
		}
	},
	methods:{
		test: function(){
			return []
		},
		toogleMenu: function(){
			this.showMenu = !this.showMenu;
		},
		selectCounty: function(){
			this.selectedCounty = event.target.textContent;
			this.selectedSite = {
				County: '',
				SiteName: '--',
				AQI: '--',
				O3: '--',
				PM10: '--',
				'PM2.5': '--',
				CO: '--',
				SO2: '--',
				NO2: '--',
				status: ''
			}
		},
		selectSite: function(el){
			this.selectedSite = el;
		},
		statusClass: function(el){
			if (el.AQI <= 50) {
				return 'AQI-50'
			}else if(el.AQI <= 100){
				return 'AQI-100'
			}else if(el.AQI <= 150){
				return 'AQI-150'
			}else if(el.AQI <= 200){
				return 'AQI-200'
			}else if(el.AQI <= 300){
				return 'AQI-300'
			}else if(el.AQI <= 400){
				return 'AQI-400'
			}else{
				return ''
			}
		}
	},
	computed:{
		countyList: function(){
			let ar = [];
			for(el of this.data){
				if (!ar.includes(el.County)) {
					ar.push(el.County);
				}
			}
			return ar
		},
		siteNameList: function(){
			let ar = [];
			for(el of this.data){
				if (el.County === this.selectedCounty) {
					ar.push(el);
				}
			}
			return ar
		},
		
	}
});
