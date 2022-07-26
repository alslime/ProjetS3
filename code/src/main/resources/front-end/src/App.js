import {Routes, Route} from "react-router-dom";
import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";
import {Component} from "react";

class App extends Component {
	render() {
		if(window.teacherRole){
			return (<div>
				<Routes>
					<Route path={'/'} element={<TeacherPage />} />
				</Routes>
			</div>);
		}
		else{
			return (<div>
				<Routes>
					<Route path={'/'} element={<StudentPage />} />
				</Routes>
			</div>);
		}
	}
}

export default App;