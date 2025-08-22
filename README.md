# DOTNET API & ANGULAR FRONTEND WITH EF TEMPLATE

Template includes:

DOTNET:
- dotnet 8 with Entity Framework and Entity Framework Auth
- MySQL docker compose file to run db locally
- Program.cs split into extensions
- Controllers with BaseApiController
- Entities and Dtos
- Repository Pattern example
- Services with Interfaces
- Token creation
- EF roles (Admin, User)
- AutoMapper
- Middleware (Exception, OnActionExecution Filter, Authentication with JWT + Role-base authorization)
- In Memory Cache (IMemoryCache)
- MessageBroker (RabbitMQ)

ANGULAR:
- Signals (user.service, signin.component, categories.component...)
- BehaviorSubject & Observable (tag.service, tag.component)
- Compare the use of BehaviorSubject & Observable (tag.component & service) vs. Signal (category.component & service)
- Child-Parent communication: @Input, @Output & EventEmmiter (tags.component, list.component, modal.component)
- Reusable components with dynamic props (form.component, list.component)
- Inserting components to other components: ng-template & ng-content (modal.component)
- Route Guards (auth.guard, app.routes)
- @HostListener (modal.component)
- Custom Directive (*appHasRole="['Admin', 'User']") has-role.directive.ts

AWS DEPLOYMENT

