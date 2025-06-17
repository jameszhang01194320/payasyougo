import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const Login = ({ onLogin }) => {
  const [inputs, setInputs] = useState({
    username: '', // <-- 修改：Django Token认证默认使用 username
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // 每次提交前清空错误信息

    try {
      // <-- 修改：API 请求 URL 为 Django 后端的 Token 认证端点
      const response = await axios.post('http://127.0.0.1:8000/api/login/', { // 注意URL末尾的斜杠
        username: inputs.username, // <-- 确保这里使用 username
        password: inputs.password
      });

      // Django REST Framework 的 Token 认证成功时，响应只包含 'token' 字段
      if (response.data && response.data.token) {
        const token = response.data.token;

        // 将 Token 存储在 localStorage
        localStorage.setItem('authToken', token); // 推荐使用更明确的键名如 'authToken'

        // 可选：如果你希望在登录成功后立即获取用户详细信息并存储，可以这样做
        // 在实际项目中，通常会在登录成功后调用 /api/users/me/ 或 /api/users/{id}/ 获取用户完整数据
        // 这里只是一个简化示例，你可以根据需要调整 onLogin 函数
        // 例如，如果 onLogin 需要 user 对象，你需要在这里发送另一个请求获取
        // 假设 onLogin 只需要知道用户已登录，或者你可以修改其签名
        onLogin(true); // 假设 onLogin 只是一个标记登录状态的函数

        navigate('/'); // 重定向到仪表盘
      } else {
        setError('登录失败：服务器响应无效。'); // 更具体的错误信息
      }

    } catch (err) {
      console.error('Login error:', err.response || err); // 打印详细错误信息便于调试
      if (err.response) {
        if (err.response.status === 400) { // DRF 认证失败通常返回 400 Bad Request
          // 400 错误通常包含 'non_field_errors' 或具体字段的错误
          if (err.response.data && err.response.data.non_field_errors) {
            setError(err.response.data.non_field_errors[0]); // 显示第一个非字段错误
          } else {
            setError('无效的用户名或密码。'); // 默认错误
          }
        } else if (err.response.data && err.response.data.detail) {
          setError(err.response.data.detail); // 显示 DRF 返回的 detail 信息
        } else {
          setError('登录失败：' + (err.response.statusText || '未知错误'));
        }
      } else {
        setError('网络错误或服务器无响应。请稍后再试。');
      }
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">Login</h1>
      <Form onSubmit={handleSubmit}>
        {/* <-- 修改：将 Email 输入字段的 name 和 value 绑定到 username --> */}
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label> {/* <-- 可选：将 Label 改为 Username 更明确 */}
          <Form.Control
            type="text" // <-- 可选：如果 username 允许非邮箱格式，改为 type="text"
            name="username"
            value={inputs.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </Form.Group>
        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
};

export default Login;