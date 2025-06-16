# PayAsYouGo/backend/accounts/views.py

from rest_framework import generics, viewsets, permissions

# --- 确保导入以下所有内容 ---
from rest_framework.exceptions import NotFound # <-- 导入 NotFound
from rest_framework.views import APIView      # <-- 导入 APIView
from rest_framework.response import Response  # <-- 导入 Response
from rest_framework import status             # <-- 导入 status
# --- 导入结束 ---
# ... (确保导入了其他需要的模块和模型)
from rest_framework.authtoken.models import Token # <-- 导入 Token model
from django.contrib.auth import authenticate      # <-- 导入 authenticate 函数
from rest_framework.permissions import AllowAny   # <-- 确保导入 AllowAny (或者 permissions.AllowAny)

from rest_framework.permissions import IsAuthenticated # 假设你需要用户登录才能访问
from .models import AuditLog, CustomUser, Client, Expense, Invoice, InvoiceItem, Payment, Setting, TaxEstimation, TimeEntry # 导入你需要操作的模型
from .serializers import ( # <-- 修改这里，列出所有你需要的序列化器
    CustomUserSerializer,
    ClientSerializer,
    InvoiceSerializer,
    RegisterSerializer,
    InvoiceItemSerializer,    # <-- 确保这些都已添加
    TimeEntrySerializer,      # <--
    ExpenseSerializer,        # <--
    PaymentSerializer,        # <--
    TaxEstimationSerializer,  # <--
    SettingSerializer,        # <--
    AuditLogSerializer,
    UserLoginResponseSerializer        # <--
)
from accounts import serializers

# 自定义登录视图
class CustomLoginView(APIView):
    permission_classes = (AllowAny,) # 允许任何人尝试登录

    def post(self, request, format=None):
        username = request.data.get('username') # 从请求数据中获取用户名
        password = request.data.get('password') # 从请求数据中获取密码

        # 使用 Django 的 authenticate 函数验证凭据
        user = authenticate(username=username, password=password)

        if user:
            # 如果认证成功，获取或创建一个 Token
            token, created = Token.objects.get_or_create(user=user)
            
            # 使用 UserLoginResponseSerializer 序列化用户数据
            user_serializer = UserLoginResponseSerializer(user)

            # 返回 Token 和序列化后的用户数据
            return Response({
                'token': token.key,
                'user': user_serializer.data # <-- 在响应中包含用户数据
            }, status=status.HTTP_200_OK)
        else:
            # 如果认证失败
            return Response(
                {'detail': 'Invalid credentials.'},
                status=status.HTTP_400_BAD_REQUEST
            )

# 用户注册视图
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (permissions.AllowAny,) # 允许任何用户（包括未认证用户）访问注册接口
    serializer_class = RegisterSerializer
    
# CustomUser 的 ViewSet
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated] # 只有认证用户才能访问

# Client 的通用视图 (列表创建和详情更新删除)
class ClientListCreateView(generics.ListCreateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]

    # 确保新创建的客户端与当前登录用户关联
    def perform_create(self, serializer):
        serializer.save(user=self.request.user) # 假设 Client 模型中有 user 字段

class ClientRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]
    # 确保用户只能访问自己的客户端数据
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


# Invoice 的通用视图 (类似 Client)
class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user) # 假设 Invoice 模型中有 user 字段

class InvoiceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

# ... 为其他每个模型定义相应的视图 (ListCreateAPIView 和 RetrieveUpdateDestroyAPIView)

# 账单项 (InvoiceItem) 视图
class InvoiceItemListCreateView(generics.ListCreateAPIView):
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    # 确保新创建的账单项关联到当前用户的发票
    def perform_create(self, serializer):
        invoice_id = self.request.data.get('invoice') # 从请求数据中获取 invoice ID
        if not invoice_id:
            raise serializers.ValidationError({"invoice": "Invoice ID is required."})

        try:
            # 查找属于当前用户的发票
            invoice = Invoice.objects.get(id=invoice_id, user=self.request.user)
        except Invoice.DoesNotExist:
            raise serializers.ValidationError({"invoice": "Invoice not found or does not belong to the current user."})

        # 将账单项与查找到的发票关联
        serializer.save(invoice=invoice)

    # 确保用户只能查看其所属发票的账单项
    def get_queryset(self):
        # 如果是管理员，可以看到所有账单项
        if self.request.user.is_staff or self.request.user.is_superuser:
            return self.queryset
        # 否则，只能看到自己发票下的账单项
        # 通过 invoice__user 查找关联到当前用户的发票的账单项
        return self.queryset.filter(invoice__user=self.request.user)


class InvoiceItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    # 确保用户只能修改或删除其所属发票的账单项
    def get_queryset(self):
        # 如果是管理员，可以看到所有账单项
        if self.request.user.is_staff or self.request.user.is_superuser:
            return self.queryset
        # 否则，只能看到自己发票下的账单项
        return self.queryset.filter(invoice__user=self.request.user)

class TimeEntryListCreateView(generics.ListCreateAPIView):
    queryset = TimeEntry.objects.all()
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(user=self.request.user) # 假设 TimeEntry 有 user 字段
    def get_queryset(self): # 仅返回当前用户的工时
        return self.queryset.filter(user=self.request.user)

class TimeEntryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TimeEntry.objects.all()
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self): # 仅允许访问当前用户的工时
        return self.queryset.filter(user=self.request.user)

# 费用 (类似工时)
class ExpenseListCreateView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class ExpenseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
# 支付 (Payment) 视图
class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    # 确保新创建的支付记录与当前登录用户关联
    def perform_create(self, serializer):
        # 支付记录通常也关联到用户和发票
        # 确保从请求数据中获取 invoice 字段，或者根据业务逻辑进行关联
        # 假设前端会发送 invoice_id
        serializer.save(user=self.request.user) # 假设 Payment 模型中有 user 字段

    # 确保用户只能查看自己的支付记录
    def get_queryset(self):
        # 如果是管理员，可以看到所有支付记录
        if self.request.user.is_staff or self.request.user.is_superuser:
            return self.queryset
        # 否则，只能看到自己的支付记录
        return self.queryset.filter(user=self.request.user)


class PaymentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    # 确保用户只能修改或删除自己的支付记录
    def get_queryset(self):
        # 如果是管理员，可以看到所有支付记录
        if self.request.user.is_staff or self.request.user.is_superuser:
            return self.queryset
        # 否则，只能看到自己的支付记录
        return self.queryset.filter(user=self.request.user)

# 税务预估 (通常是 OneToOneField，可能只有 List 和 Update)

# 税务预估 (TaxEstimation) 视图 - 修正为处理 OneToOneField
# 为了一对一关系，通常会有一个 retrieve 方法来获取单个对象
# 且创建是 CreateAPIView, 获取/更新/删除是 RetrieveUpdateDestroyAPIView
# 考虑到用户只有一个设置，我们可以在 /api/tax-estimation/ 路径下同时处理获取和更新，以及创建（如果不存在）


class TaxEstimationDetailView(generics.RetrieveUpdateAPIView): # RetrieveUpdateAPIView 用于获取和更新单个对象
    queryset = TaxEstimation.objects.all()
    serializer_class = TaxEstimationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self): # 覆盖 get_object 方法来获取当前用户的唯一 TaxEstimation
        try:
            return self.get_queryset().get(user=self.request.user)
        except TaxEstimation.DoesNotExist:
            raise NotFound(detail="Tax estimation settings not found for this user.")

    def get_queryset(self): # 仍然只返回当前用户的 TaxEstimation
        return self.queryset.filter(user=self.request.user)

    # 如果用户没有 TaxEstimation 记录，但尝试 GET，我们希望返回 404 而不是 []
    # get_object 已经处理了 DoesNotExist，会抛出 NotFound。

    # 对于创建 (如果不存在 TaxEstimation)：
    # 由于是 RetrieveUpdateAPIView，它没有 Create 功能。
    # 我们可以通过 POST 请求到相同的 /api/tax-estimation/ URL 来实现创建逻辑，
    # 但这需要一个自定义视图，或者在前端进行条件判断。
    # 更简单的方式是，前端在 GET 失败（404）时，引导用户去 POST 创建。
    # 或者我们使用一个自定义的 APIView 来统一处理 GET/POST/PUT。

# 修正：我们将 TaxEstimation 视图简化为一个 APIView，来统一处理获取或创建/更新
class TaxEstimationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        try:
            # 尝试获取当前用户的税务预估设置
            tax_estimation = TaxEstimation.objects.get(user=request.user)
            serializer = TaxEstimationSerializer(tax_estimation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TaxEstimation.DoesNotExist:
            # 如果没有找到，返回 404 Not Found，并提示前端进行创建
            return Response(
                {"detail": "Tax estimation settings not found. Please create one.", "code": "NOT_SET"},
                status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request, format=None):
        # 尝试更新现有设置
        try:
            tax_estimation = TaxEstimation.objects.get(user=request.user)
            serializer = TaxEstimationSerializer(tax_estimation, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK) # 更新成功返回 200 OK
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TaxEstimation.DoesNotExist:
            # 如果不存在，则创建新设置
            serializer = TaxEstimationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user) # 确保关联当前用户
                return Response(serializer.data, status=status.HTTP_201_CREATED) # 创建成功返回 201 Created
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, format=None): # PUT 也可以用来更新
        return self.post(request, format) # 将 PUT 请求也导向 POST 处理，实现创建或更新

    # 如果需要删除，可以添加 delete 方法
    # def delete(self, request, format=None):
    #     try:
    #         tax_estimation = TaxEstimation.objects.get(user=request.user)
    #         tax_estimation.delete()
    #         return Response(status=status.HTTP_204_NO_CONTENT)
    #     except TaxEstimation.DoesNotExist:
    #         raise Http404

class TaxEstimationListCreateView(generics.ListCreateAPIView): # 或 RetrieveUpdateAPIView
    queryset = TaxEstimation.objects.all()
    serializer_class = TaxEstimationSerializer
    permission_classes = [IsAuthenticated]
    # 对于 OneToOneField，通常是 get_or_create 逻辑，用户只有一个 TaxEstimation
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    def perform_create(self, serializer):
        # 确保每个用户只有一个 TaxEstimation
        serializer.save(user=self.request.user) #, defaults={'tax_percentage': 0.00})

class TaxEstimationRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaxEstimation.objects.all()
    serializer_class = TaxEstimationSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

# 设置 (与税务预估类似，通常是 OneToOneField)
class SettingListCreateView(generics.ListCreateAPIView): # 或 RetrieveUpdateAPIView
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SettingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

# AuditLog (可能只有 List 或 Read-only)
class AuditLogListView(generics.ListAPIView):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]
    # 审计日志通常只读，且可能只显示当前用户的相关日志
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user) # 假设你想只看自己的日志网址 ( accounts/urls.py)：

