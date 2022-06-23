import {Routes, Route} from "react-router-dom";

import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";
import {Component} from "react";

class App extends Component {
	render() {
		return (<div>
			<Routes>
				<Route path={'/'} element={<StudentPage />} />
				<Route path={'/teacher'} element={<TeacherPage />} />
			</Routes>
		</div>);
	}
}

export default App;