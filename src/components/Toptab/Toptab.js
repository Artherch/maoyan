import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Text } from '@tarojs/components'
import searchPng from "../../assets/images/search.png"
import ico1Png from "../../assets/images/2D.png"
import ico2Png from "../../assets/images/3D.png"
import heart from "../../assets/images/heart.png"
import "./Toptab.scss"

export default class Toptab extends Component {
    constructor(props) {
        super(...arguments);
        let data = Taro.getStorageSync("cities");
        this.state = {
            name: data.geoCity ? data.geoCity.nm : '',
            navTab:["正在热映","即将上映"],
            currentNavtab:0
        }
    }

    switchTab(index){
        this.setState({
            currentNavtab:index
        })
    }

    render() {
        return (
            <View>
                // 头部切换
                <View className='top-tab flex-wrp flex-tab'>
                    <View className="location">
                        {this.state.name}
                        <View className='cityArrow'></View>
                    </View>
                    {
                        this.state.navTab.map((item,index) => {
                            return(
                                <View className={this.state.currentNavtab === index ? 'toptab flex-item active' : 'toptab flex-item'} key={index} onClick={this.switchTab.bind(this,index)}>{item}</View>
                            )
                        })
                    }
                    <View className="search">
                        <Image src={searchPng}></Image>
                    </View>
                </View>
            </View>
        )
    }
}