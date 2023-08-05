// ElementUI全部引入
// import ElementUI from 'element-ui';
// -----------------------------------------------
// ElementUI按需引入
import Vue from 'vue'
import {
  Link,
  Badge,
  Image,
  Timeline,
  TimelineItem,
  Card,
  Alert,
  Switch,
  Divider,
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Collapse,
  CollapseItem,
  DatePicker,
  Popover,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tooltip,
  Icon,
  Row,
  Col,
  Upload,
  Cascader,
  Tag,
  MessageBox,
  Message,
  Scrollbar,
  Drawer,
  Descriptions,
  DescriptionsItem,
  Result,
  Loading,
  Statistic
} from 'element-ui'


const components = {
  Link,
  Badge,
  Image,
  Timeline,
  TimelineItem,
  Card,
  Alert,
  Switch,
  Divider,
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  DatePicker,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Popover,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tooltip,
  Icon,
  Row,
  Col,
  Upload,
  Collapse,
  CollapseItem,
  Cascader,
  MessageBox,
  Message,
  Tag,
  Scrollbar,
  Drawer,
  Descriptions,
  DescriptionsItem,
  Result,
  Statistic
};
const Elementui = (Vue, config = {}) => {
  if (Elementui.installed) {
    return;
  }
  Object.keys(components).forEach((key => {
    Vue.component(components[key].name, components[key]);
  }))
  Vue.prototype.$msgbox = MessageBox;
  //   Vue.prototype.$message = Message;
  Vue.prototype.$msg = function (options) {
    let iconcls;
    if (options.type === 'error') {
      iconcls = '#icon-cuowu'
    } else if (options.type === 'warning') {
      iconcls = '#icon-jinggao1'
    } else {
      iconcls = '#icon-chenggong'
    }
    const msg = Message({
      dangerouslyUseHTMLString: true, // 将dangerouslyUseHTMLString属性设置为 true，message 就会被当作 HTML 片段处理。
      message: `
		<svg class="icon svg-icon titleicon" aria-hidden="true">
			<use xlink:href="${iconcls}"></use>
		</svg>
		<p class="el-message__content">${options.msg}</p>
		`,
      duration: options.duration || 2000,
      center: true
    })
    return msg
  }
  Vue.prototype.$msgClose = function (options) {
    const msgClose = Message.closeAll()
    return msgClose
  }
}

Vue.use(Elementui);
Vue.use(Loading.directive);