import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const Register = () => {
  const [inputs, setInputs] = useState({
    username: '', // <-- 新增：对应 Django 的 username
    email: '',
    phone_number: '', // <-- 修改：对应 Django 的 phone_number
    password: '',
    password2: '', // <-- 新增：用于确认密码
    first_name: '', // <-- 可选：对应 Django 的 first_name
    last_name: ''   // <-- 可选：对应 Django 的 last_name
    // company_name: '' // 如果前端表单有，也可以添加
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
      // <-- 修改：API 请求 URL 为 Django 后端的注册端点
      const response = await axios.post('http://127.0.0.1:8000/api/register/', { // 注意URL末尾的斜杠
        username: inputs.username,
        email: inputs.email,
        phone_number: inputs.phone_number, // 发送给 Django 的 phone_number 字段
        password: inputs.password,
        password2: inputs.password2, // 发送确认密码
        first_name: inputs.first_name, // 如果有对应的输入框，发送
        last_name: inputs.last_name,   // 如果有对应的输入框，发送
        // company_name: inputs.company_name // 如果有，发送
      });

      // 注册成功后，Django REST Framework 的 CreateAPIView 默认会返回创建的用户数据
      if (response.data && response.data.id) { // 检查响应是否有用户ID
        alert('注册成功！请登录。'); // 简单的成功提示
        navigate('/login'); // 重定向到登录页面
      } else {
        setError('注册失败：服务器响应无效。');
      }

    } catch (err) {
      console.error('Registration error:', err.response || err); // 打印详细错误信息便于调试
      if (err.response) {
        if (err.response.status === 400) { // DRF 验证失败通常返回 400 Bad Request
          // 400 错误通常包含字段级别的错误或 non_field_errors
          if (err.response.data) {
            let errorMessages = [];
            for (const key in err.response.data) {
              // 遍历所有错误字段，将错误信息收集起来
              if (Array.isArray(err.response.data[key])) {
                errorMessages.push(`${key}: ${err.response.data[key].join(', ')}`);
              } else if (typeof err.response.data[key] === 'string') {
                 errorMessages.push(err.response.data[key]);
              }
            }
            setError(errorMessages.join('\n') || '注册信息无效。');
          } else {
            setError('注册失败：无效的请求数据。');
          }
        } else if (err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          setError('注册失败：' + (err.response.statusText || '未知错误'));
        }
      } else {
        setError('网络错误或服务器无响应。请稍后再试。');
      }
    }
  };


  return (
    <Container className="mt-5">
      <h1 className="text-center">Register</h1>
      <Form onSubmit={handleSubmit}>
        {/* <-- 新增：Username 字段 --> */}
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={inputs.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </Form.Group>

        {/* <-- 调整：Phone 字段名称为 phone_number 匹配后端模型 --> */}
        <Form.Group controlId="formPhoneNumber" className="mt-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            name="phone_number" // <-- 修改：name 对应后端字段
            value={inputs.phone_number}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </Form.Group>

        {/* <-- 可选：如果你希望前端也收集 first_name 和 last_name --> */}
        <Form.Group controlId="formFirstName" className="mt-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            value={inputs.first_name}
            onChange={handleChange}
            placeholder="Enter your first name"
          />
        </Form.Group>

        <Form.Group controlId="formLastName" className="mt-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            value={inputs.last_name}
            onChange={handleChange}
            placeholder="Enter your last name"
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

        {/* <-- 新增：确认密码字段 --> */}
        <Form.Group controlId="formPassword2" className="mt-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="password2"
            value={inputs.password2}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Register
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
};

export default Register;